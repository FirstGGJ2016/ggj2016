var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection ||
                       window.webkitRTCPeerConnection || window.msRTCPeerConnection;
var RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription ||
                       window.webkitRTCSessionDescription || window.msRTCSessionDescription;

RTC = function(caller, roomId) {
  var conf = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
    ],
  };

  var self = this;

  this._offerOptions = { offerToReceiveAudio: true, offerToReceiveVideo: true };
  this._caller = caller || false;
  this._roomId = roomId;

  this._pc = new RTCPeerConnection(conf);

  this._pc.onicecandidate = this._onIceCandidate.bind(this);
  this._pc.onaddstream = this._onAddStream.bind(this);

  this._audio = new Audio();

  Streamy.on('' + roomId, this._signaling.bind(this));

  Tracker.autorun(this._connection.bind(this));

  this.init();
};

RTC.prototype.init = function() {
  var self = this;

  this._audio.start(function(stream) {
    self._addStream(stream);
  });
};

RTC.prototype.call = function() {
  this._createOffer();
};

RTC.prototype._signaling = function(sig) {
  sig = JSON.parse(sig.data);

  if (!sig.candidate || sig.user === Meteor.userId()) return;

  this._pc.addIceCandidate(new RTCIceCandidate(sig.candidate));
};

RTC.prototype._onIceCandidate = function(e) {
  //TODO: what the fuck is this?
  var self = this;

  setTimeout(function() {
    Streamy.broadcast('' + self._roomId, { data: JSON.stringify({ candidate: e.candidate, user: Meteor.userId() }) });
  }, 1500);
};

RTC.prototype._onAddStream = function(e) {
  //TODO: new stream!! Show it!

  var aud = $('#audio');

  // e.stream = this._audio._getUserMedia(e.stream);
  Session.set('homeTemp', 'gameInterface');
  aud[0].src = URL.createObjectURL(e.stream);
};

RTC.prototype._addStream = function(stream) {
  this._pc.addStream(stream);
};

RTC.prototype._saveLocalDes = function(des, caller) {
  this._pc.setLocalDescription(des);

  Meteor.call('updateRTC', JSON.stringify(des), caller);
};

RTC.prototype._saveRemoteDes = function(des, caller) {
  this._pc.setRemoteDescription(des);

  Meteor.call('updateRTC', JSON.stringify(des), caller);
};

RTC.prototype._offerSuccess = function(offer) {
  // Save the offer in local.
  this._saveLocalDes(offer, this._caller);
};

RTC.prototype._createOffer = function() {
  //TODO: create offer

  this._pc.createOffer(this._offerSuccess.bind(this), this._fail, this._offerOptions);
};

RTC.prototype._createAnswer = function() {
  //TODO: answer
  this._pc.createAnswer(this._offerSuccess.bind(this), this._fail);
};

RTC.prototype._connection = function() {
  var id = Meteor.userId(),
      room = Rooms.findOne({ $or: [{ owner: id }, { 'person.id':id }, { 'spirit.id':id }] },
      { field: this._caller ? { callee:1 } : { caller:1 } });

  if (!room || this._done) return;

  if (this._caller && room.callee) {
    this._pc.setRemoteDescription(new RTCSessionDescription(room.callee));
    this._done = true;
  } else if (!this._caller && room.caller) {

    Session.set('homeTemp', 'gameInterface');

    this._done = true;
    this._pc.setRemoteDescription(new RTCSessionDescription(room.caller));
    this._createAnswer();
  }
};

RTC.prototype._handleCall = function(caller) {

};

RTC.prototype._fail = function() {

};
