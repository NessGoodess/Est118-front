export type Colonias = string[];

export type Cps = {
    [cp: string]: Colonias;
};

export type Municipios = {
    [municipio: string]: Cps;
};

export type Estados = {
    [estado: string]: Municipios;
};


