export const getAllBoards = () => {
  return {
    type: "GET_ALL_BOARDS",
  };
};

export const createBoard = () => {
  return {
    type: "CREATE_BOARD",
    payload: {
        title: "new board",
        background_color: [ 128, 128, 128 ]
    }
  };
};
