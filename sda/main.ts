import { SimpleDB } from "@nshiab/simple-data-analysis";

const sdb = new SimpleDB({ cacheVerbose: true });

const fires = sdb.newTable("fires");
await fires.cache(async () => {
  await fires.loadData(
    "https://raw.githubusercontent.com/nshiab/simple-data-analysis/main/test/geodata/files/firesCanada2023.csv",
  );

  await fires.points("lat", "lon", "geom");
});
await fires.logTable();

const provinces = sdb.newTable("provinces");
await provinces.cache(async () => {
  await provinces.loadGeoData(
    "https://raw.githubusercontent.com/nshiab/simple-data-analysis/main/test/geodata/files/CanadianProvincesAndTerritories.json",
  );
});
await provinces.logTable();

const firesInsideProvinces = await fires.joinGeo(provinces, "inside", {
  outputTable: "firesInsideProvinces",
});
await firesInsideProvinces.logTable();

await sdb.done();
