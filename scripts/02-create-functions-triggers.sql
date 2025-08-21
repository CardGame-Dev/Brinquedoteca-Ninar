-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for items table
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON public.items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'Usuário'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to check reservation conflicts
CREATE OR REPLACE FUNCTION check_reservation_conflict(
  p_item_id UUID,
  p_start_time TIMESTAMP WITH TIME ZONE,
  p_end_time TIMESTAMP WITH TIME ZONE,
  p_reservation_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.reservations
    WHERE item_id = p_item_id
    AND status = 'ativa'
    AND (p_reservation_id IS NULL OR id != p_reservation_id)
    AND (
      (start_time <= p_start_time AND end_time > p_start_time) OR
      (start_time < p_end_time AND end_time >= p_end_time) OR
      (start_time >= p_start_time AND end_time <= p_end_time)
    )
  );
END;
$$;

-- Function to update item status based on reservations and usage
CREATE OR REPLACE FUNCTION update_item_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update item status based on current state
  IF TG_OP = 'INSERT' THEN
    IF NEW.type = 'uso' THEN
      UPDATE public.items SET status = 'em_uso' WHERE id = NEW.item_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
    -- Check if item should be available or has active reservations
    DECLARE
      has_active_usage BOOLEAN;
      has_active_reservation BOOLEAN;
    BEGIN
      -- Check for active usage (movements without return)
      SELECT EXISTS(
        SELECT 1 FROM public.movements m1
        WHERE m1.item_id = COALESCE(NEW.item_id, OLD.item_id)
        AND m1.type = 'uso'
        AND NOT EXISTS(
          SELECT 1 FROM public.movements m2
          WHERE m2.item_id = m1.item_id
          AND m2.user_id = m1.user_id
          AND m2.type = 'devolucao'
          AND m2.created_at > m1.created_at
        )
      ) INTO has_active_usage;
      
      -- Check for active reservations
      SELECT EXISTS(
        SELECT 1 FROM public.reservations
        WHERE item_id = COALESCE(NEW.item_id, OLD.item_id)
        AND status = 'ativa'
        AND start_time <= NOW()
        AND end_time > NOW()
      ) INTO has_active_reservation;
      
      -- Update status accordingly
      IF has_active_usage THEN
        UPDATE public.items SET status = 'em_uso' WHERE id = COALESCE(NEW.item_id, OLD.item_id);
      ELSIF has_active_reservation THEN
        UPDATE public.items SET status = 'reservado' WHERE id = COALESCE(NEW.item_id, OLD.item_id);
      ELSE
        UPDATE public.items SET status = 'disponivel' WHERE id = COALESCE(NEW.item_id, OLD.item_id);
      END IF;
    END;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Triggers for automatic status updates
CREATE TRIGGER update_item_status_on_movement
  AFTER INSERT OR UPDATE OR DELETE ON public.movements
  FOR EACH ROW
  EXECUTE FUNCTION update_item_status();
