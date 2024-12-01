/*:
 * @plugindesc Adds a custom number slider for age selection with dynamic labels, a confirm button, and user instructions in events.
 * @author Andrew Lerma
 */

(function () {
    // Custom window class for the number slider
    function Window_NumberSlider() {
        this.initialize.apply(this, arguments);
    }

    Window_NumberSlider.prototype = Object.create(Window_Base.prototype);
    Window_NumberSlider.prototype.constructor = Window_NumberSlider;

    Window_NumberSlider.prototype.initialize = function (x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._min = 1; // Minimum age
        this._max = 100; // Maximum age
        this._value = 1; // Initial age value
        this.refresh();
    };

    Window_NumberSlider.prototype.refresh = function () {
        this.contents.clear();
        this.drawText("How old are you?", 0, 0, this.contents.width, 'center');

        // Display left and right arrow indicators around the number
        const leftArrow = "◄";
        const rightArrow = "►";
        let label = this.getAgeLabel(this._value);
        this.drawText(`${leftArrow} ${this._value} ${label} ${rightArrow}`, 0, this.lineHeight(), this.contents.width, 'center');

        this.drawText("Confirm", 0, this.lineHeight() * 2, this.contents.width, 'center');
        this.drawText("Use left and right to select your age. Submit with the action key.", 0, this.lineHeight() * 3, this.contents.width, 'center');
    };

    Window_NumberSlider.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        if (Input.isRepeated('right')) {
            this._value = Math.min(this._value + 1, this._max);
            this.refresh();
        } else if (Input.isRepeated('left')) {
            this._value = Math.max(this._value - 1, this._min);
            this.refresh();
        }

        if (Input.isTriggered('ok')) {
            this.onConfirm();
        }
    };

    Window_NumberSlider.prototype.getAgeLabel = function (age) {
        if (age >= 0 && age <= 7) {
            return "(wee)";
        } else if (age >= 8 && age <= 16) {
            return "(lil)";
        } else if (age >= 17 && age <= 29) {
            return "";
        } else if (age >= 30 && age <= 39) {
            return "OLD";
        } else if (age >= 40 && age <= 45) {
            return "On Death's Door";
        } else if (age > 45) {
            return "Dead";
        }
        return "";
    };

    Window_NumberSlider.prototype.onConfirm = function () {
        let age = this._value;

        if (age >= 30 && age <= 39) {
            // Valid age selected, trigger the next event step
            $gameVariables.setValue(1, age); // Use a game variable to store the selected age
            SceneManager.pop(); // Exit the custom scene and continue the event
        } else {
            // Invalid age range
            $gameMessage.add("I'm sorry, I need to talk to someone my own age.");
            // Set a self-switch to end the event script
            const eventId = $gameMap._interpreter.eventId();
            $gameSelfSwitches.setValue([$gameMap.mapId(), eventId, 'A'], true); // Self-Switch A ON
            
            SceneManager.pop(); // Exit the custom scene
        }
    };

    // Scene for custom number slider
    function Scene_NumberSlider() {
        this.initialize.apply(this, arguments);
    }

    Scene_NumberSlider.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_NumberSlider.prototype.constructor = Scene_NumberSlider;

    Scene_NumberSlider.prototype.initialize = function () {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_NumberSlider.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        const windowHeight = this.calcCustomWindowHeight(4); // Calculate window height for 4 lines
        this._numberSliderWindow = new Window_NumberSlider(0, 0, Graphics.boxWidth, windowHeight);
        this.addWindow(this._numberSliderWindow);
    };

    // Correct function to calculate the window height
    Scene_NumberSlider.prototype.calcCustomWindowHeight = function (numLines) {
        // Calculate the height of the window based on the number of lines
        const lineHeight = Window_Base.prototype.lineHeight.call(this);
        const padding = Window_Base.prototype.standardPadding.call(this) * 2;
        return lineHeight * numLines + padding;
    };

    Scene_NumberSlider.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
    };

    // Command to call the custom number slider scene
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        if (command === 'ShowNumberSlider') {
            SceneManager.push(Scene_NumberSlider);
        }
    };

})();
