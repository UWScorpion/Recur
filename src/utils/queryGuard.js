import md5 from 'md5';

var guards = {};

export const queryGuard = (dispatch, f) => {
  return (...a) => {
    const key = md5(JSON.stringify({
      name: f.name,
      args: a,
    }));
    if (guards[key]) {
      return;
    }
    guards[key] = true;
    return dispatch(f.apply(null, a));
  };
}
