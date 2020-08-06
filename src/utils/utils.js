
export const orderSort = (a, b) => {
  return ((a.data ? parseInt(JSON.parse(a.data).order) : 0) > (b.data ? parseInt(JSON.parse(b.data).order) : 0)) ? 1 : -1;
}

