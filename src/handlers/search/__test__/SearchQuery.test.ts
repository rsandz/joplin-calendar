import { buildSearchQuery } from "../SearchQuery";

describe("SearchQuery", () => {
  const testQuery = "testQuery";
  const testOrderBy = "created_time";
  const testOrderDir = "DESC";
  const testSearchConstraints = {
    notebook: "testNotebook",
  };

  const expectedFields = [
    "id",
    "title",
    "user_created_time",
    "user_updated_time",
  ];

  it("builds search query basic happy path", () => {
    const query = buildSearchQuery({
      query: testQuery,
    });

    expect(query).toStrictEqual({
      query: testQuery,
      fields: expectedFields,
    });
  });

  it("builds search query with multiple props", () => {
    const query = buildSearchQuery({
      query: testQuery,
      page: 2,
      limit: 2,
      orderBy: testOrderBy,
      orderDir: testOrderDir,
      searchConstraints: testSearchConstraints,
    });

    expect(query).toStrictEqual({
      query: 'testQuery notebook:"testNotebook"',
      fields: expectedFields,
      page: 2,
      limit: 2,
      order_by: testOrderBy,
      order_dir: testOrderDir,
    });
  });

  it("builds search query with page", () => {
    const query = buildSearchQuery({
      query: testQuery,
      page: 2,
    });

    expect(query).toStrictEqual({
      query: testQuery,
      fields: expectedFields,
      page: 2,
    });
  });

  it("builds search query with limit", () => {
    const query = buildSearchQuery({
      query: testQuery,
      limit: 10,
    });

    expect(query).toStrictEqual({
      query: testQuery,
      fields: expectedFields,
      limit: 10,
    });
  });

  it("builds search query with orderBy", () => {
    const query = buildSearchQuery({
      query: testQuery,
      orderBy: testOrderBy,
    });

    expect(query).toStrictEqual({
      query: testQuery,
      fields: expectedFields,
      order_by: testOrderBy,
    });
  });

  it("builds search query with orderDir", () => {
    const query = buildSearchQuery({
      query: testQuery,
      orderDir: testOrderDir,
    });

    expect(query).toStrictEqual({
      query: testQuery,
      fields: expectedFields,
      order_dir: testOrderDir,
    });
  });

  it("builds search query with searchConstraints", () => {
    const query = buildSearchQuery({
      query: testQuery,
      searchConstraints: testSearchConstraints,
    });

    expect(query).toStrictEqual({
      query: 'testQuery notebook:"testNotebook"',
      fields: expectedFields,
    });
  });
});
