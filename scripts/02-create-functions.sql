-- Funções e triggers para automatizar o sistema

-- Função para atualizar o timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para verificar conflitos de reserva
CREATE OR REPLACE FUNCTION check_reservation_conflict(
    p_item_id UUID,
    p_start_time TIMESTAMP WITH TIME ZONE,
    p_end_time TIMESTAMP WITH TIME ZONE,
    p_reservation_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    conflict_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO conflict_count
    FROM reservations
    WHERE item_id = p_item_id
      AND status = 'active'
      AND (p_reservation_id IS NULL OR id != p_reservation_id)
      AND (
        (start_time <= p_start_time AND end_time > p_start_time) OR
        (start_time < p_end_time AND end_time >= p_end_time) OR
        (start_time >= p_start_time AND end_time <= p_end_time)
      );
    
    RETURN conflict_count = 0;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar status do item baseado em reservas e movimentações
CREATE OR REPLACE FUNCTION update_item_status(p_item_id UUID)
RETURNS VOID AS $$
DECLARE
    current_movement movements%ROWTYPE;
    active_reservation reservations%ROWTYPE;
    new_status VARCHAR(20);
BEGIN
    -- Verificar se há movimentação ativa (checkout sem return)
    SELECT * INTO current_movement
    FROM movements
    WHERE item_id = p_item_id
      AND action = 'checkout'
      AND returned_at IS NULL
    ORDER BY started_at DESC
    LIMIT 1;

    -- Verificar se há reserva ativa
    SELECT * INTO active_reservation
    FROM reservations
    WHERE item_id = p_item_id
      AND status = 'active'
      AND start_time <= NOW()
      AND end_time >= NOW()
    LIMIT 1;

    -- Determinar o novo status
    IF current_movement.id IS NOT NULL THEN
        -- Item está em uso
        IF current_movement.started_at + INTERVAL '4 hours 10 minutes' < NOW() THEN
            new_status := 'overdue';
        ELSE
            new_status := 'in_use';
        END IF;
    ELSIF active_reservation.id IS NOT NULL THEN
        new_status := 'reserved';
    ELSE
        new_status := 'available';
    END IF;

    -- Atualizar o status do item
    UPDATE items
    SET status = new_status
    WHERE id = p_item_id;
END;
$$ LANGUAGE plpgsql;
