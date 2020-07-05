# Dustin's Security Module

## Default environment

All JWT's will be checked/signed with `secret` and have the default issuer of `dustin.sh/api`
unless you pass different values when using the middleware or if you change the following variables

```env
JWT_ISSUER=new_issuer
INTERNAL_SECRET=new_secret
```

dotenv is not included, and this will only use system variables. If you want to use your .env
import dotenv in your own codebase before importing this module.
