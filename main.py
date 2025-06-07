import tkinter as tk
from AppKit import NSApp, NSWindowCollectionBehaviorCanJoinAllSpaces, NSScreen
import Quartz
import ctypes

# Определение экрана с активным окном
def get_active_screen():
    active_app = Quartz.CGWindowListCopyWindowInfo(
        Quartz.kCGWindowListOptionOnScreenOnly,
        Quartz.kCGNullWindowID
    )
    for window in active_app:
        if window.get("kCGWindowOwnerName") != "Window Server":
            bounds = window["kCGWindowBounds"]
            x, y = bounds["X"], bounds["Y"]
            for screen in NSScreen.screens():
                frame = screen.frame()
                if (
                    frame.origin.x <= x < frame.origin.x + frame.size.width and
                    frame.origin.y <= y < frame.origin.y + frame.size.height
                ):
                    return screen
    return NSScreen.mainScreen()

def main():
    root = tk.Tk()
    root.title("Моё первое графическое приложение")
    root.geometry("400x300")

    label = tk.Label(root, text="Привет, мир!", font=("Arial", 20))
    label.pack(pady=50)

    root.attributes("-topmost", True)
    root.update()
    NSApp.activateIgnoringOtherApps_(True)
    NSApp.windows()[0].setCollectionBehavior_(NSWindowCollectionBehaviorCanJoinAllSpaces)


    def follow_active_screen():
        screen = get_active_screen()
        if screen:
            frame = screen.frame()
            root.geometry(f"+{int(frame.origin.x + 100)}+{int(frame.origin.y + 100)}")  # смещение
        root.after(1000, follow_active_screen)

    follow_active_screen()
    root.mainloop()

if __name__ == "__main__":
    main()
