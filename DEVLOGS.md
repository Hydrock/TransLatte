# DevLogs

## Проблема отображения на верхнем слое

Проблема:

После продолжительной работы приложение перестаёт корректно открываться поверх всех окон, и macOS может:
 • переключать пользователя на другой рабочий стол (space),
 • не поднимать окно на передний план,
 • “забывать”, что окно должно быть always-on-top.

Причины (по наблюдениям сообщества Electron):

1. macOS Spaces (рабочие столы) конфликтуют с окнами, открытыми с setVisibleOnAllWorkspaces(true) + setAlwaysOnTop(true) без фокуса.
2. Иногда macOS отказывает окну “в праве быть сверху”, если оно давно не перерисовывалось.
3. Окна, у которых app.dock.hide() применяется, могут странно себя вести при повторном фокусе.
