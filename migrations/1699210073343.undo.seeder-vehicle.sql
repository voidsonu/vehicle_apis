-- 1699210073343.undo.seeder-vehicle.sql

DELETE FROM vehicles
WHERE "vehicle_model" IN (
    'Toyota camry',
    'Honda accord',
    'mazda6',
    'porse 911',
    'ferrari 458 italia',
    'lamborgini hurcan',
    'ducati',
    'YAMAHA MT 15'
);