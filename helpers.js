// Get the account service to use for the user's avatar
// Priority: Twitter > Facebook > Google > GitHub > Instagram
getService = function (user) {
  var profileProp = Avatar.options.profilePictureProperty;
  if      (profileProp && user && user.profile && user.profile[profileProp]) { return 'profile'; }
  else if (user && user.services && user.services.twitter)   { return 'twitter'; }
  else if (user && user.services && user.services.facebook)  { return 'facebook'; }
  else if (user && user.services && user.services.google)    { return 'google'; }
  else if (user && user.services && user.services.github)    { return 'github'; }
  else if (user && user.services && user.services.instagram) { return 'instagram'; }
  else                                                       { return 'none'; }
};

getGravatarUrl = function (user, defaultUrl) {
  var gravatarDefault;
  var validGravatars = ['404', 'mm', 'identicon', 'monsterid', 'wavatar', 'retro', 'blank'];

  // Initials are shown when Gravatar returns 404.
  if (Avatar.options.fallbackType !== 'initials') {
    var valid = _.contains(validGravatars, Avatar.options.gravatarDefault);
    gravatarDefault = valid ? Avatar.options.gravatarDefault : defaultUrl;
  }
  else {
    gravatarDefault = '404';
  }

  var options = {
    // NOTE: Gravatar's default option requires a publicly accessible URL,
    // so it won't work when your app is running on localhost and you're
    // using an image with either the standard default image URL or a custom
    // defaultImageUrl that is a relative path (e.g. 'images/defaultAvatar.png').
    default: gravatarDefault,
    size: 200, // use 200x200 like twitter and facebook above (might be useful later)
    secure: true
  };

  var emailOrHash = getEmailOrHash(user);
  return Gravatar.imageUrl(emailOrHash, options);
};


//allows for accessing deeper fields in the user object similar to how mongo does it e.g user.profile.email_hash
//see http://stackoverflow.com/a/8052100/2621563
getDescendantProp = function(obj, desc) {
    var arr = desc.split(".");
    while(arr.length && (obj = obj[arr.shift()]));
    //console.log(obj)
    return obj;
}

// Get the user's email address or (if the emailHashProperty is defined) hash
getEmailOrHash = function (user) {
  var emailOrHash;
  if (user && Avatar.options.emailHashProperty && getDescendantProp(user,Avatar.options.emailHashProperty)){
    emailOrHash = getDescendantProp(user,Avatar.options.emailHashProperty);
  }
  else if (user && user.emails) {
    emailOrHash = user.emails[0].address; // TODO: try all emails
  }
  else {
    // If all else fails, return 32 zeros (trash hash, hehe) so that Gravatar
    // has something to build a URL with at least.
    emailOrHash = '00000000000000000000000000000000';
  }
  return emailOrHash;
};
