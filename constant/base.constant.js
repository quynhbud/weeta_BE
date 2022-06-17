/**
 * 0: Hoc sinh, sinh vien
 * 1: Nguoi lao dong
 */
const TYPE_USER = {
    SV: 0,
    NV: 1,
};

/** Cac vi tri gan nha tro
 * 0: Truong hoc
 * 1: Cho
 * 2: Sieu thi
 * 3: Benh vien
 * 4: Tram xe buyt
 * 5: Khu mua sam
 * 6: Thu vien
 * 7: Cua hang tien loi
 * 8: Cong an phuong
 * 9: Nha thuoc
 * 10: Cay xang
 * 11: Ngan hang
 */
const PLACES = {
    SCHOOL: 0,
    MARKET: 1,
    SUPERMARKET: 2,
    HOSPITAL: 3,
    BUS_STOP: 4,
    MALL: 5,
    LIBRARY: 6,
    GROCERY: 7,
    POLICE_STATION: 8,
    PHARMACY: 9,
    GAS: 10,
    BANK: 11,
};

module.exports = {
    TYPE_USER,
    PLACES,
};
