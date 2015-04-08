# sharepoint-efforts
Custom editor text field in the SharePoint 365 to record effort
## Описание
В SharePoint 365 создаются задачи. Необходимо каждый день фиксировать трудозатраты исполнителей (один и более). 

В этой версии SharePoint отсутствует возможность создания сложного поля, можно только выбрать из существующих.
В данном решении создаём поле (id поля, в нашем случае, "Effort") с типом "многострочный текст", для сохранения трудозатрат в формате JSON, и реализуем удобный редактор этого поля.

Формат JSON:
{"Исполнитель 1":{"01.04.2015":6, "02.04.2015":3},
"Исполнитель 2":{"03.04.2015":4, "04.04.2015":5}}
## Установка
