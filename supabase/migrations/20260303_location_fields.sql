-- Add location fields to housing listings
alter table housing_listings add column if not exists lat double precision;
alter table housing_listings add column if not exists lng double precision;
alter table housing_listings add column if not exists landmark text;

-- Add location fields to car listings  
alter table car_listings add column if not exists lat double precision;
alter table car_listings add column if not exists lng double precision;
alter table car_listings add column if not exists landmark text;

-- Add location fields to service listings
alter table service_listings add column if not exists lat double precision;
alter table service_listings add column if not exists lng double precision;
alter table service_listings add column if not exists landmark text;
