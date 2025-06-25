CREATE OR REPLACE FUNCTION public.generate_task_identifier()
RETURNS TRIGGER AS $$
DECLARE
    next_val INTEGER;
BEGIN
    SELECT nextval('task_identifier_seq') INTO next_val;
    NEW.task_identifier = 'STX-' || lpad(next_val::TEXT, 5, '0');
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_task_identifier
BEFORE INSERT ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.generate_task_identifier(); 