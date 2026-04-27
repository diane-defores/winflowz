-- Run with two authenticated users and one unauthenticated session.
-- Replace :user_a and :user_b placeholders in your SQL client workflow.

-- 1) Own-user allow.
insert into public.transcriptions (user_id, raw_text, cleaned_text, source, duration_ms)
values (auth.uid(), 'hello', 'Hello.', 'free', 1000);

-- 2) Forged user_id deny.
insert into public.transcriptions (user_id, raw_text, cleaned_text, source, duration_ms)
values (:user_b, 'forged', 'forged', 'free', 1000);

-- 3) Empty payload deny.
insert into public.transcriptions (raw_text, cleaned_text, source, duration_ms)
values ('', '', 'free', 0);

-- 4) Snippet uniqueness per user.
insert into public.snippets (trigger, content) values ('sig', 'Best regards');
insert into public.snippets (trigger, content) values ('SIG', 'Duplicate should fail');

-- 5) Cross-user read deny.
select * from public.clipboard_items where user_id = :user_b;
