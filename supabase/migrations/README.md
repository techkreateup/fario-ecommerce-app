# Database Migrations

Migrations are applied in numerical order.

## Migration List:
- `001_create_tables.sql` - Core database tables (products, orders, users, etc.)
- `002_setup_rls.sql` - Row Level Security policies
- `003_add_triggers.sql` - Database triggers for stock management
- `004_setup_storage.sql` - Storage buckets for product images

## How to Apply:
```bash
# Apply all migrations
supabase db reset

# Or apply specific migration
supabase migration up <migration_name>
```
