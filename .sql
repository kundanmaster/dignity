-- Step 1: Create the sequence
CREATE SEQUENCE user_id_seq
START WITH 1001
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;

-- Step 3: Create the trigger function
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
   NEW.user_id = nextval('user_id_seq');
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create the trigger
CREATE TRIGGER set_user_id_trigger
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION set_user_id();
