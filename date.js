// This is a module and as it's an object we can send 
// multiple exporst but we need to make multiple objects for it.
exports.getDate = function() {
  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  return today.toLocaleDateString("en-US", options);
}
exports.getDay = function() {
  const today = new Date();
  const options = {
    weekday: "long"
  };
  return today.toLocaleDateString("en-US", options);
}
