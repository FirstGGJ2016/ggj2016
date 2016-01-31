var latest = true;

Accounts.onCreateUser(function(options, user) {
  // We still want the default hook's 'profile' behavior.

  user.profile = options.profile || {};
  latest = user.profile.isPerson = !latest;

  return user;
});
