# BACKUP & RECOVERY PROCEDURE

## Automatic Backups:
- Frequency: Daily at 2 AM IST
- Retention: 7 days (Supabase free tier) / 30 days (Pro)
- Type: Point-in-Time Recovery enabled

## Manual Backup:
```bash
# Using Supabase CLI:
supabase db dump -f backup_$(date +%Y%m%d).sql

# Or from dashboard:
# Settings > Database > Download Database Backup
```

## Recovery Steps:
1. Go to Dashboard > Database > Backups
2. Select backup timestamp
3. Click "Restore"
4. Confirm restoration
5. Wait 5-10 minutes
6. Verify data integrity

## Emergency Contact:
- Supabase Support: support@supabase.io
- Project Dashboard: https://supabase.com/dashboard/project/csyiiksxpmbehiiovlbg
