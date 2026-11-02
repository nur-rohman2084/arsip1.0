export const TUR = [
  ["Turret Laser", "t0"],
  ["Turret Meriam", "t1"],
  ["Turret Rudal", "t2"],
  ["Turret Perisai", "t3"],
  ["Turret Penguat", "t4"],
  ["Turret Pembeku", "t5"],
  ["Turret Pemulih", "t6"],
  ["Turret Radar", "t7"]
];

export const TOWER = ["tw0", "tw1", "tw2", "tw3", "tw4", "tw5", "tw6", "tw7"];

export const POS = [
  [6.6, 27],
  [28, 27],
  [55.7, 27],
  [79, 27],
  [92, 58],
  [67.6, 58],
  [43.7, 58],
  [19, 57]
];

export const CLO = ["c0", "c1", "c2", "c3", "c4", "c5"];
export const HAI = ["h0", "h1", "h2", "h3", "h4", "h5"];
export const ACC = ["a0", "a1", "a2", "a3", "a4", "a5"];

export const CN = ["Kemeja kotak", "Kaos hijau", "Hoodie biru", "Baju zirah", "Jaket cokelat", "Mantel"];
export const HN = ["Kuning", "Cokelat", "Cokelat poni", "Hitam", "Kepang", "Panjang"];
export const AN = ["Headphone", "Syal", "Ransel", "Kacamata", "Jam tangan", "Tas"];

export const ini = (n = '') => n.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

export const avOf = (a) => {
  if (!a) return "av0";
  return a.c === 0 && a.a === 0 ? "avH" : a.c === 0 ? "avP" : "av0";
};
