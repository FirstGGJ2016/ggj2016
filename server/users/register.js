var latest = true;

Accounts.onCreateUser(function(options, user) {
  // We still want the default hook's 'profile' behavior.
  console.log(latest);
  user.profile = options.profile || {};
  latest = user.profile.isPerson = !latest;

  return user;
});
