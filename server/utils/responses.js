module.exports.createUserResponse = ({ ok, user = null, error = null }) => {
  if (error) console.log('error', error);
  return {
    ok,
    user,
    error,
  };
};

module.exports.createGeneralResponse = ({
  ok,
  message = null,
  error = null,
}) => {
  if (error) console.log('error', error);
  return {
    ok,
    message,
    error,
  };
};

module.exports.createAuthenticationResponse = ({
  ok,
  token = null,
  refreshToken = null,
  user = null,
  error = null,
}) => {
  if (error) console.log('error', error);
  return {
    ok,
    token,
    refreshToken,
    user,
    error,
  };
};

module.exports.createProductsResponse = ({
  ok,
  products = null,
  error = null,
  searchText = null,
}) => {
  if (error) console.log('error', error);
  return {
    ok,
    products,
    error,
  };
};
module.exports.createCompaniesResponse = ({
  ok,
  companies = null,
  error = null,
  searchText = null,
}) => {
  if (error) console.log('error', error);
  return {
    ok,
    companies,
    error,
  };
};
