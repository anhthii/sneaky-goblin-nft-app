import Airtable from "airtable";

// Setting
const _baseTableName = "Whitelisted";
const _base = new Airtable({ apiKey: "key1EvDV5ABKQESES" }).base(
  "appDnlLD88YhTEvYR"
);

// APIs
export const ATCreate = async (_payload) => {
  try {
    const res = await _base(_baseTableName).create([
      {
        fields: _payload,
      },
    ]);

    if (res) return { status: "success", message: "Successfully created doc." };
  } catch (e) {
    return { status: "failed", message: e.message };
  }
};

export const ATCheckIfExist = (dataToCheck) => {
  return new Promise((resolve, reject) => {
    const _data = [];

    _base(_baseTableName)
      .select({
        maxRecords: 1,
        filterByFormula: `address = "${dataToCheck}"`,
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach((record) => {
            _data.push({
              id: record._rawJson.id,
              ...record._rawJson.fields,
            });
          });
          try {
            fetchNextPage();
          } catch (e) {
            return;
          }
        },
        function done(err) {
          if (err) {
            reject(err);
          } else {
            resolve(_data);
          }
        }
      );
  });
};

export const ATGetAllRecords = () => {
  return new Promise((resolve, reject) => {
    const _data = [];

    _base(_baseTableName)
      .select({
        maxRecords: 100,
        view: "Grid view",
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach((record) => {
            _data.push({
              ...record._rawJson.fields,
            });
          });
          try {
            fetchNextPage();
          } catch (e) {
            return;
          }
        },
        function done(err) {
          if (err) {
            reject(err);
          } else {
            resolve(_data);
          }
        }
      );
  });
};
