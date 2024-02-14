const { uploadFile, getFileDetails } = require("../controllers/fileController");

describe("uploadFile", () => {
  test("Error Case", async () => {
    const req = {
      file: {
        buffer: Buffer.from("test,content,goes,here"),
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const upload = jest
      .fn()
      .mockImplementation((req, res, cb) => cb(new Error("Test Error")));
    await uploadFile(req, res, upload);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "An error occurred while uploading file",
    });
  });

  test("Empty File Case", async () => {
    const req = {
      file: {
        buffer: Buffer.from(""),
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await uploadFile(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "An error occurred while uploading file",
    });
  });

  test("Invalid File Format Case", async () => {
    const req = {
      file: {
        buffer: Buffer.from("test,content,goes,here"),
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await uploadFile(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "An error occurred while uploading file",
    });
  });
});

describe("getFileDetails", () => {
  test("getFileDetails - Table exists", async () => {
    const connection = {
      query: jest.fn().mockResolvedValueOnce([[{}], [{}]]),
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await getFileDetails({}, res);
    expect(res.status).toHaveBeenCalledWith(200); // Update this line
    // expect(res.json).toHaveBeenCalledWith({
    //   success: true,
    //   message: "Details loaded",
    //   results: [{}],
    // });
  });
});
