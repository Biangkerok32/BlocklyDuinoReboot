/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Helper functions for generating Arduino for blocks.
 * @author gasolin@gmail.com (Fred Lin)
 * @reboot scanet@libreduc.cc (SebCanet)
 */
'use strict';

goog.provide('Blockly.Arduino');

goog.require('Blockly.Generator');

/*
 * Arduino Board profiles
 *
 */

var profile = {
	none: {
	    description: "",
		cpu:"",
		speed:"",
	    digital: [],
		PWM : [],
		dropdownPWM: [],
		analog : [],
		dropdownAnalog: [],
		/*irqonchange: [],*/
		I2C: [],
		SPI: [],
		interrupt: [],
		picture : "media/boards/Arduino_none.jpg",
		miniPicture : "media/boards/Arduino_none_mini.jpg",
		miniPicture_hor : "media/boards/Arduino_none_mini_hor.jpg",
		serial: [],
		serialPin: [],
		upload_arg: "none",
	},
	arduino_leonardo: {
	    description: "Arduino Leonardo",
		cpu:"atmega32u4",
		speed:"57600",
	    digital: ["0", "1",  "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
		dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
		PWM : ["3", "5", "6", "9", "10", "11", "13"],
		dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"], ["13", "13"]],
		analog : ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A6", "A7", "A8", "A9", "A10", "A11"],
		dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6(D4)", "4"], ["A7(D6)", "6"], ["A8(D8)", "8"], ["A9(D9)", "9"], ["A10(D10)", "10"], ["A11(D12)", "12"]],
		/*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
		I2C: ["2", "3"],
		SPI: ["connect"],
		interrupt: ["3", "2", "0", "1", "7"],
		picture : "media/boards/Arduino-Leonardo-Pinout.jpg",
		miniPicture : "media/boards/Arduino-Leonardo-Pinout-mini.jpg",
		miniPicture_hor : "media/boards/Arduino-Leonardo-Pinout-mini_hor.jpg",
		serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
                ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
                ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
                ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
                ['115200', '115200']],
		serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
		upload_arg: "arduino:avr:leonardo",
	},
	arduino_mega:{
		description: "Arduino Mega 2560 / ADK",
		cpu:"atmega2560",
		speed:"115200",
		digital : ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52"],
		dropdownDigital: "attention",
		PWM : ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "44", "45", "46"],
		dropdownPWM: [["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"], ["44", "44"], ["45", "45"], ["46", "46"]],
		analog : ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15"],
		dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"], ["A8", "A8"], ["A9", "A9"], ["A10", "A10"], ["A11", "A11"], ["A12", "A12"], ["A13", "A13"], ["A14", "A14"], ["A15", "A15"]],
		/*irqonchange : [["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"], ["50", "50"], ["51", "51"], ["52", "52"], ["53", "53"], ["A8", "62"], ["A9", "63"], ["A10", "64"], ["A11", "65"], ["A12", "66"], ["A13", "67"], ["A14", "68"], ["A15", "69"]],*/
		I2C: ["20", "21"],
		SPI: [["50 (SS)", "50"], ["51 (MOSI)", "51"], ["52 (MISO)", "52"], ["53 (SCK)", "53"]],
		interrupt: ["2", "3", "21", "20", "19", "18"],
		picture : "media/boards/Arduino-Mega-2560-Pinout.jpg",
		miniPicture : "media/boards/Arduino-Mega-2560-Pinout-mini.jpg",
		miniPicture_hor : "media/boards/Arduino-Leonardo-Pinout-mini_hor.jpg",
		serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
                ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
                ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
                ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
                ['115200', '115200']],
		serialPin: [["0 (Rx) ; 1 (Tx)", "0"], ["19 (Rx1) ; 18 (Tx1)", "19"], ["17 (Rx2) ; 16 (Tx2)", "17"], ["15 (Rx3) ; 14 (Tx3)", "15"]],
		upload_arg: "arduino:avr:mega:cpu=atmega2560",
	},
	arduino_micro: {
	    description: "Arduino Micro",
		cpu:"atmega32u4",
		speed:"57600",
	    digital: ["0", "1",  "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
		dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
		PWM : ["3", "5", "6", "9", "10", "11", "13"],
		dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"], ["13", "13"]],
		analog : ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A6", "A7", "A8", "A9", "A10", "A11"],
		dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6(D4)", "4"], ["A7(D6)", "6"], ["A8(D8)", "8"], ["A9(D9)", "9"], ["A10(D10)", "10"], ["A11(D12)", "12"]],
		/*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
		I2C: ["2", "3"],
		SPI: ["connect"],
		interrupt: [["0(Rx)", "0"], ["1(Tx)", "1"], ["2", "2"], ["3", "3"], ["7", "7"]],
		picture : "media/boards/Arduino-Micro-Pinout.jpg",
		miniPicture : "media/boards/Arduino-Micro-Pinout-mini.jpg",
		miniPicture_hor : "media/boards/Arduino-Leonardo-Pinout-mini_hor.jpg",
		serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
                ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
                ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
                ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
                ['115200', '115200']],
		serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
		upload_arg: "arduino:avr:micro",
	},
	arduino_mini: {
	    description: "Arduino Mini ATmega328",
		cpu:"atmega328p",
		speed:"115200",
	    digital: ["0", "1",  "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
		dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
		PWM : ["3", "5", "6", "9", "10", "11"],
		dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
		analog : ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"],
		dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"]],
		I2C: ["A4", "A5"],
		SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
		interrupt: [["2", "2"], ["3", "3"]],
		picture : "media/boards/Arduino-Mini-Pinout.jpg",
		miniPicture : "media/boards/Arduino-Mini-Pinout-mini.jpg",
		miniPicture_hor : "media/boards/Arduino-Leonardo-Pinout-mini_hor.jpg",
		serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
                ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
                ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
                ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
                ['115200', '115200']],
		serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
		upload_arg: "arduino:avr:mini",
	},
	arduino_nano: {
	    description: "Arduino Nano ATmega328",
		cpu:"atmega328p",
		speed:"115200",
	    digital: ["0", "1",  "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
		dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
		PWM : ["3", "5", "6", "9", "10", "11"],
		dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
		analog : ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"],
		dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"]],
		/*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
		I2C: ["A4", "A5"],
		SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
		interrupt: ["2", "3"],
		picture : "media/boards/Arduino-Nano-Pinout.jpg",
		miniPicture : "media/boards/Arduino-Nano-Pinout-mini.jpg",
		miniPicture_hor : "media/boards/Arduino-Leonardo-Pinout-mini_hor.jpg",
		serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
                ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
                ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
                ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
                ['115200', '115200']],
		serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
		upload_arg: "arduino:avr:nano:cpu=atmega328old",
	},
	arduino_pro8: {
	    description: "Arduino Pro Mini 3.3V ATmega328",
		cpu:"atmega328p",
		speed:"57600",
	    digital: ["0", "1",  "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
		dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
		PWM : ["3", "5", "6", "9", "10", "11"],
		dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
		analog : ["A0", "A1", "A2", "A3", "A4", "A5"],
		dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
		I2C: ["A4", "A5"],
		SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
		interrupt: [["2", "2"], ["3", "3"]],
		picture : "media/boards/Arduino-Pro-Mini-Pinout.jpg",
		miniPicture : "media/boards/Arduino-Pro-Mini-Pinout-mini.jpg",
		miniPicture_hor : "media/boards/Arduino-Leonardo-Pinout-mini_hor.jpg",
		serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
                ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
                ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
                ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
                ['115200', '115200']],
		serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
		upload_arg: "arduino:avr:pro:cpu=8MHzatmega328",
	},
	arduino_pro16: {
	    description: "Arduino Pro Mini 5V ATmega328",
		cpu:"atmega328p",
		speed:"57600",
	    digital: ["0", "1",  "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
		dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
		PWM : ["3", "5", "6", "9", "10", "11"],
		dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
		analog : ["A0", "A1", "A2", "A3", "A4", "A5"],
		dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
		I2C: ["A4", "A5"],
		SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
		interrupt: [["2", "2"], ["3", "3"]],
		picture : "media/boards/Arduino-Pro-Mini-Pinout.jpg",
		miniPicture : "media/boards/Arduino-Pro-Mini-Pinout-mini.jpg",
		miniPicture_hor : "media/boards/Arduino-Leonardo-Pinout-mini_hor.jpg",
		serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
                ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
                ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
                ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
                ['115200', '115200']],
		serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
		upload_arg: "arduino:avr:pro:cpu=16MHzatmega328",
	},
	arduino_uno: {
	    description: "Arduino Uno",
		cpu:"atmega328p",
		speed:"115200",
	    digital: ["0", "1",  "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
		dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
		PWM : ["3", "5", "6", "9", "10", "11"],
		dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
		analog : ["A0", "A1", "A2", "A3", "A4", "A5"],
		dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
		/*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
		I2C: ["A4", "A5"],
		SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
		interrupt: ["2", "3"],
		picture : "media/boards/Arduino-Uno-Pinout.jpg",
		miniPicture : "media/boards/Arduino-Uno-Pinout-mini.jpg",
		miniPicture_hor : "media/boards/Arduino-Leonardo-Pinout-mini_hor.jpg",
		serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
                ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
                ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
                ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
                ['115200', '115200']],
		serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
		upload_arg: "arduino:avr:uno",
	},
	arduino_yun: {
	    description: "Arduino Yùn",
		cpu:"atmega32u4",
		speed:"57600",
	    digital: ["0", "1",  "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
		dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
		PWM : ["3", "5", "6", "9", "10", "11", "13"],
		dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"], ["13", "13"]],
		analog : ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A6", "A7", "A8", "A9", "A10", "A11"],
		dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6(D4)", "4"], ["A7(D6)", "6"], ["A8(D8)", "8"], ["A9(D9)", "9"], ["A10(D10)", "10"], ["A11(D12)", "12"]],
		/*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
		I2C: ["A4", "A5"],
		SPI: ["connect"],
		interrupt: ["3", "2", "0", "1", "7"],
		picture : "media/boards/Arduino-Yun-Pinout.jpg",
		miniPicture : "media/boards/Arduino-Yun-Pinout-mini.jpg",
		miniPicture_hor : "media/boards/Arduino-Leonardo-Pinout-mini_hor.jpg",
		serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
                ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
                ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
                ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
                ['115200', '115200']],
		serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
		upload_arg: "arduino:avr:yun",
	},
	lilypad: {
	    description: "LilyPad Arduino ATmega328P",
		cpu:"atmega328p",
		speed:"57600",
	    digital: ["0", "1",  "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
		dropdownDigital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
		PWM : ["3", "5", "6", "9", "10", "11"],
		dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
		analog : ["A0", "A1", "A2", "A3", "A4", "A5"],
		dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
		/*irqonchange: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],["A0", "14"], ["A1", "15"], ["A2", "16"], ["A3", "17"], ["A4", "18"], ["A5", "19"]],*/
		I2C: ["A4", "A5"],
		SPI: [["10 (SS)", "10"], ["11 (MOSI)", "11"], ["12 (MISO)", "12"], ["13 (SCK)", "13"]],
		interrupt: ["2", "3"],
		picture : "media/boards/LilyPad-Pinout.jpg",
		miniPicture : "media/boards/LilyPad-Pinout-mini.jpg",
		miniPicture_hor : "media/boards/Arduino-Leonardo-Pinout-mini_hor.jpg",
		serial: [['300', '300'], ['600', '600'], ['1200', '1200'],
                ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
                ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
                ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
                ['115200', '115200']],
		serialPin: [["0 (Rx) ; 1 (Tx)", "0"]],
		upload_arg: "arduino:avr:lilypad",
	}
};

//set default profile to arduino standard-compatible board
profile["default"] = profile["arduino_uno"];