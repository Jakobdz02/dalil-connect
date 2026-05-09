
insert into storage.buckets (id, name, public)
values ('guide-photos', 'guide-photos', true)
on conflict (id) do nothing;

create policy "Guide photos: public read"
on storage.objects for select
using (bucket_id = 'guide-photos');

create policy "Guide photos: owner upload"
on storage.objects for insert
with check (
  bucket_id = 'guide-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Guide photos: owner update"
on storage.objects for update
using (
  bucket_id = 'guide-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Guide photos: owner delete"
on storage.objects for delete
using (
  bucket_id = 'guide-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);
