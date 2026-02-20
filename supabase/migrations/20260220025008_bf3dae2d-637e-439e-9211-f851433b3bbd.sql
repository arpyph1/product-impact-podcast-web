
-- Auto-assign admin role to arpy@ph1.ca when they sign up
CREATE OR REPLACE FUNCTION public.auto_assign_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'arpy@ph1.ca' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER auto_admin_on_profile_create
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.auto_assign_admin();
