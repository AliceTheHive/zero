const { get } = require("../request");
const cheerio = require("cheerio");

// React Page
test("React Stateless", () => {
  //expect.assertions(1);
  return get("/react/stateless").then(data => {
    const $ = cheerio.load(data);
    expect(
      $("body")
        .text()
        .trim()
    ).toBe("react-stateless");
  });
});

test("React With Imports", () => {
  //expect.assertions(1);
  return get("/react/withimports").then(data => {
    const $ = cheerio.load(data);
    expect(
      $("body")
        .text()
        .trim()
    ).toBe("246react-stateless");
  });
});

test("React With Helmet", () => {
  //expect.assertions(1);
  return get("/react/withhelmet").then(data => {
    const $ = cheerio.load(data);
    expect(
      $("head title")
        .text()
        .trim()
    ).toBe("Page Title");
  });
});

test("React With Custom Meta Charset", () => {
  //expect.assertions(1);
  return get("/react/withcustomcharset").then(data => {
    const $ = cheerio.load(data);
    expect($("head [charset]").attr("charset")).toBe("ISO-8859-1");
  });
});

test("React With Default Meta Charset", () => {
  //expect.assertions(1);
  return get("/react/withhelmet").then(data => {
    const $ = cheerio.load(data);
    expect($("head [charset]").attr("charset")).toBe("utf-8");
  });
});

test("React With getInitialProps", () => {
  //expect.assertions(1);
  return get("/react/withInitialProps").then(data => {
    const $ = cheerio.load(data);
    expect(
      $("body")
        .text()
        .trim()
    ).toBe("2,4,6");
  });
});

test("React With SCSS Style", () => {
  //expect.assertions(1);
  return get("/react/withStyle").then(data => {
    const $ = cheerio.load(data);
    expect(
      $('head [rel="stylesheet"]')
        .attr("href")
        .endsWith("bundle.css")
    ).toBe(true);
  });
});

test("React With Hooks", () => {
  //expect.assertions(1);
  return get("/react/withHook").then(data => {
    const $ = cheerio.load(data);
    expect($("p").text()).toBe("You clicked 0 times");
  });
});

test("React With TypeScript", () => {
  //expect.assertions(1);
  return get("/react/typescript").then(data => {
    const $ = cheerio.load(data);
    expect($("b").text()).toBe("Hello TypeScript");
  });
});

test("React With Class Properties", () => {
  //expect.assertions(1);
  return get("/react/withClassProperties").then(data => {
    const $ = cheerio.load(data);
    expect($("button").text()).toBe("Click Me!");
  });
});

test("React With No Bundling", () => {
  //expect.assertions(1);
  return get("/react/nobundling").then(data => {
    const $ = cheerio.load(data);
    expect($("script").length).toBe(0);
  });
});

test("React With CSS import from node_modules", () => {
  //expect.assertions(1);
  return get("/react/withnpmstyle").then(data => {
    const $ = cheerio.load(data);
    expect($("button").text()).toBe("Button");
  });
});

// TODO: test parcel output
