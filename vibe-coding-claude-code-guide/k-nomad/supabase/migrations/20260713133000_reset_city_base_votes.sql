update public.cities
set
  base_likes = 0,
  base_dislikes = 0
where base_likes <> 0
  or base_dislikes <> 0;
