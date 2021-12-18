export const noteDTOtoNote = (dto) => {
    let backgroundColor = [
        dto.backgroundColorR,
        dto.backgroundColorG,
        dto.backgroundColorB,
    ];

    delete dto.backgroundColorR;
    delete dto.backgroundColorG;
    delete dto.backgroundColorB;

    return {
        ...dto,
        noteId: dto.id,
        backgroundColor: backgroundColor,
    };
};

export const boardDTOtoBoard = (dto) => {
    
    let backgroundColor = [
        dto.backgroundColorR,
        dto.backgroundColorG,
        dto.backgroundColorB,
    ];
    
    let defaultBackgroundColor = [
        dto.defaultBackgroundColorR,
        dto.defaultBackgroundColorG,
        dto.defaultBackgroundColorB,
    ];

    delete dto.backgroundColorR;
    delete dto.backgroundColorG;
    delete dto.backgroundColorB;
    delete dto.defaultBackgroundColorR;
    delete dto.defaultBackgroundColorG;
    delete dto.defaultBackgroundColorB;

    if (dto.notes != null) {
        dto.notes = dto.notes.map((noteDTO) => noteDTOtoNote(noteDTO))
    }

    let newBoard = {
        ...dto,
        boardId: dto.id,
        backgroundColor: backgroundColor,
        defaultNoteBackgroundColor: defaultBackgroundColor,
    };

    return newBoard;
};

export const workspaceDTOtoWorkspace = (dto) => {
    return {
        ...dto,
        boards: dto.boards.map((boardDto) => boardDTOtoBoard(boardDto))
    }
};
