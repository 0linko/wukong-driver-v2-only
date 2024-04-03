radio.onReceivedNumber(function (receivedNumber) {
    PIR_sensor = receivedNumber == 1
})
function fire () {
    return pins.digitalReadPin(DigitalPin.P2) == 0
}
function alarm_light (index: number) {
    wukong_RGB.setPixelColor(index, neopixel.colors(NeoPixelColors.Orange))
    wukong_RGB.show()
    basic.pause(150)
    wukong_RGB.setPixelColor(index, neopixel.colors(NeoPixelColors.Black))
    wukong_RGB.show()
}
datalogger.onLogFull(function () {
    music.play(music.tonePlayable(988, music.beat(BeatFraction.Breve)), music.PlaybackMode.InBackground)
    basic.showLeds(`
        . . # . .
        . . # . .
        . . # . .
        . . . . .
        . . # . .
        `)
    datalogger.deleteLog(datalogger.DeleteType.Full)
})
function Move_with_motors (input2: string) {
    if (input2 != "") {
        if (input2 == "motor.run") {
            wuKong.setMotorSpeed(wuKong.MotorList.M2, -100)
        } else if (input2 == "motor.reverse") {
            wuKong.setMotorSpeed(wuKong.MotorList.M2, 100)
        } else if (input2 == "motor.stop") {
            wuKong.stopMotor(wuKong.MotorList.M2)
        } else if (input2 == "servo.left") {
            wuKong.setServoAngle(wuKong.ServoTypeList._360, wuKong.ServoList.S7, 0)
        } else if (input2 == "servo.right") {
            wuKong.setServoAngle(wuKong.ServoTypeList._360, wuKong.ServoList.S7, 90)
        } else if (input2 == "servo.center") {
            wuKong.setServoAngle(wuKong.ServoTypeList._360, wuKong.ServoList.S7, 45)
        } else if (input2 == "ultramotor.left") {
            wuKong.setMotorSpeed(wuKong.MotorList.M1, 50)
            basic.pause(900)
            wuKong.stopMotor(wuKong.MotorList.M1)
        } else if (input2 == "ultramotor.right") {
            wuKong.setMotorSpeed(wuKong.MotorList.M1, -50)
            basic.pause(900)
            wuKong.stopMotor(wuKong.MotorList.M1)
        }
        execute = ""
    }
}
input.onButtonPressed(Button.A, function () {
    alarm = true
    basic.showLeds(`
        . . . . .
        . . # . .
        . # # # .
        . # # # .
        . . . . .
        `)
    main_screen()
})
function main_screen () {
    basic.showLeds(`
        . . # . .
        . . # . .
        # # # # #
        . . # . .
        . . # . .
        `)
}
input.onButtonPressed(Button.AB, function () {
    control.reset()
})
radio.onReceivedString(function (receivedString) {
    if (!(alarm)) {
        led.plot(0, 0)
        if (receivedString == "MessageGet") {
            message_arrived = true
        } else {
            execute = receivedString
            radio.sendString("MessageGet")
            datalogger.setColumnTitles(
            "Real_time",
            "Data_get",
            "Fire"
            )
            datalogger.log(
            datalogger.createCV("Real_time", input.runningTime()),
            datalogger.createCV("Data_get", receivedString),
            datalogger.createCV("Fire", fire())
            )
        }
        led.unplot(0, 0)
    }
})
input.onButtonPressed(Button.B, function () {
    alarm = false
    basic.showLeds(`
        . . . . .
        . . # . .
        . # . # .
        . # # # .
        . . . . .
        `)
    main_screen()
})
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    control.reset()
})
let message_arrived = false
let alarm = false
let execute = ""
let PIR_sensor = false
let wukong_RGB: neopixel.Strip = null
wukong_RGB = neopixel.create(DigitalPin.P16, 4, NeoPixelMode.RGB)
wukong_RGB.showColor(neopixel.colors(NeoPixelColors.Blue))
let Frontstrip = neopixel.create(DigitalPin.P1, 10, NeoPixelMode.RGB)
Frontstrip.showColor(neopixel.colors(NeoPixelColors.White))
wukong_RGB.clear()
wuKong.setLightMode(wuKong.LightMode.BREATH)
main_screen()
basic.forever(function () {
    if (alarm) {
        if (fire() || input.soundLevel() >= 200) {
            if (input.soundLevel() >= 200) {
                led.plot(4, 4)
            } else {
                led.plot(0, 4)
            }
            for (let index = 0; index < 5; index++) {
                music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
                basic.pause(input.soundLevel())
            }
            led.unplot(0, 4)
            led.unplot(4, 4)
        } else if (PIR_sensor) {
            music.play(music.tonePlayable(131, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
            basic.pause(input.soundLevel())
            music.play(music.tonePlayable(131, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
        }
        basic.pause(100)
    }
})
basic.forever(function () {
    alarm_light(0)
    alarm_light(1)
    alarm_light(2)
    alarm_light(3)
})
basic.forever(function () {
    Move_with_motors(execute)
    basic.pause(50)
})
