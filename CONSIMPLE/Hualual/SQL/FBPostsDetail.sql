DECLARE
-- Название схемы создаваемой детали.
@DetailSchemaName NCHAR(100) = 'uphPostsInPageDetail',
-- Заголовок детали.
@DetailCaption NCHAR(100) = 'Посты на странице',
--Название схемы объекта, к которому привязывается деталь.
@EntitySchemaName NCHAR(100) = 'uphFBPost'

INSERT INTO SysDetail(
    ProcessListeners,
    Caption,
    DetailSchemaUId,
    EntitySchemaUId
)
VALUES (
    0,
    @DetailCaption,
    (SELECT TOP 1 UId
    FROM SysSchema
    WHERE name = @DetailSchemaName),
    (SELECT TOP 1 UId
    FROM SysSchema
    WHERE name = @EntitySchemaName)
)

DECLARE
-- Название схемы страницы детали.
@CardSchemaName NCHAR(100) = 'uphPostsInPageEditPage',
-- Название схемы объекта, к которому привязывается деталь.
@EntitySchemaName NCHAR(100) = 'uphFBPost',
-- Заголовок страницы детали.
@PageCaption NCHAR(100) = 'Схема страницы "Посты на странице"',
-- Пустая строка.
@Blank NCHAR(100) = ''

-- Добавление записи в таблицу SysModuleEntity.
INSERT INTO SysModuleEntity(
    ProcessListeners,
    SysEntitySchemaUId
)
VALUES(
    0,
    (SELECT TOP 1 UId
    FROM SysSchema
    WHERE Name = @EntitySchemaName
    )
)

-- Добавление записи в таблицу SysModuleEdit
INSERT INTO SysModuleEdit(
    SysModuleEntityId,
    UseModuleDetails,
    Position,
    HelpContextId,
    ProcessListeners,
    CardSchemaUId,
    ActionKindCaption,
    ActionKindName,
    PageCaption
)
VALUES (
    (SELECT TOP 1 Id
    FROM SysModuleEntity
    WHERE SysEntitySchemaUId = (
        SELECT TOP 1 UId
        FROM SysSchema
        WHERE Name = @EntitySchemaName
        )
    ),
    1,
    0,
    @Blank,
    0,
    (SELECT TOP 1 UId
     FROM SysSchema
     WHERE name = @CardSchemaName
    ),
    @Blank,
    @Blank,
    @PageCaption
)