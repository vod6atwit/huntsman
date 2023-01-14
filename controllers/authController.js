const register = async (req, res) => {
  res.send('Register user');
};
const login = async (req, res) => {
  res.send('login user');
};
const updateUser = async (req, res) => {
  res.send('update User');
};

export { register, login, updateUser };
