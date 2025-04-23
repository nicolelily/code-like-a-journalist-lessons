import { SimpleDB } from "@nshiab/simple-data-analysis";
import { barX, plot } from "@observablehq/plot";

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

await firesInsideProvinces.summarize({
  values: "hectares",
  categories: "nameEnglish",
  summaries: ["count", "sum"],
  decimals: 0,
});

await firesInsideProvinces.renameColumns({
  count: "numberFires",
  sum: "burntArea",
});
await firesInsideProvinces.sort({ burntArea: "desc" });
await firesInsideProvinces.logTable();

// await firesInsideProvinces.logBarChart("nameEnglish", "burntArea");

const chart = (data: unknown[]) =>
  plot({
    marginLeft: 170,
    grid: true,
    x: { tickFormat: (d) => `${d / 1_0000_000}M`, label: "Burnt area (ha)" },
    y: { label: null },
    color: { scheme: "Reds" },
    marks: [
      barX(data, {
        x: "burntArea",
        y: "nameEnglish",
        fill: "burntArea",
        sort: { y: "-x" },
      }),
    ],
  });

await firesInsideProvinces.writeChart(
  chart,
  "./sda/output/chart.png",
);

await sdb.done();
