
const fs = require('fs');
const ROOTPATH = require('electron-root-path');
const path = require('path');
const uuid = require('uuid');
const ipcIndexRenderer = require('electron').ipcRenderer;
const OS = require('os');
var QRCode = require('qrcode');
const date_time = require('date-and-time');
// const { map } = require('jquery');
const IniFile = require(__dirname+'/assets/js/utils/IniFile.js');
const Calendar = require(__dirname+'/assets/js/include/Calendar');
const Chart = require(__dirname+'/assets/js/include/Chart.min');
// const readXlsxFile = require('read-excel-file');

var APP_NAME = 'Dr Aoun';
var API_END_POINT = '';
var PROJECT_URL = '';
var APP_ICON = 'assets/img/logo/logo.png';
var APP_ROOT_PATH = ROOTPATH.rootPath+'/';
var APP_DIR_NAME = __dirname+'/';

const APP_TMP_DIR = OS.tmpdir()+'/'+APP_NAME

const CURRENCY = {
	ar: 'دج',
	fr: 'DA',
	dzd: 'DZD',
};

const SETTINGS_FILE = 'settings';
const DISPLAY_LANG_FILE = APP_ROOT_PATH+'locale/lang.json';

var FUI_DISPLAY_LANG = undefined;

var LOGIN_SESSION = undefined;
var LOGIN_SESSION_FILE = APP_TMP_DIR+'/login/session.json';


var USER_CONFIG = {};
var USER_CONFIG_FILE = APP_TMP_DIR+'/login/config.json';

var DEFAULT_INI_SETTINGS = null;
var PERMISSIONS = [];

var GLOBALS_SCRIPT = null;

const TIME_NOW = new Date();
const CURRENT_DATE = date_time.format(TIME_NOW, 'YYYY-MM-DD');
const CURRENT_TIME = date_time.format(TIME_NOW, 'HH:mm:ss');

var NAVBAR_LINKS = {}

// Attendance
const ATT_NONE = 0;
const ATT_ABSENT = 1;
const ATT_PRESENT = 2;
const ATT_LATE = 3;
// status
const ST_YES = 2;
const ST_NO = 1;
const ST_NONE = 0;
const ST_DIRECTION_INSIDE = 'INSIDE';
const ST_DIRECTION_OUTSIDE = 'OUTSIDE';
const ST_DIRECTION_CENTER_SHIPPING = 'CENTER_SHIPPING';
const ORDER_ST_PREPARING_PHASE = 1;
const ORDER_ST_DELIVERY_PHASE = 2;
const ORDER_ST_RECEIVING_PHASE = 3;
const STATUS_WAITING = 'waiting'
const STATUS_IN_PROGRESS = 'in_progress'
const STATUS_COMPLETED = 'completed'
const STATUS_CANCELED = 'canceled'
const STATUS_LAUNCHED = 'launched'
const STATUS_APPROVED = 'approved'
// emploees types
const EMP_TYPE_TARGET_CENTER_CLINIC = 'CLINIC';
const EMP_TYPE_TARGET_CENTER_CENTRAL_ADMINISTRATION = 'CENTRAL_ADMINISTRATION';

const EMP_TYPE_MAID = 'MAID';
const EMP_TYPE_NURSE = 'NURSE';
const EMP_TYPE_DIET_SECRETARY = 'DIET_SECRETARY';
const EMP_TYPE_CHIEF_CENTER = 'CHIEF_CENTER';
const EMP_TYPE_DOCTOR = 'DOCTOR';
const EMP_TYPE_RECEPTION_SECRETARY = 'RECEPTION_SECRETARY';
const EMP_TYPE_CHIEF_ASSISTANCE = 'CHIEF_ASSISTANCE';
const EMP_TYPE_LOGISTIC_SERVICE = 'LOGISTIC_SERVICE';
const EMP_TYPE_FINANCE_ACCOUNTING_DIRECTOR = 'FINANCE_ACCOUNTING_DIRECTOR';
const EMP_TYPE_DEVELOPMENT_MARKETING = 'DEVELOPMENT_MARKETING';
const EMP_TYPE_HEALTH_SAFETY_DEPARTMENT = 'HEALTH_SAFETY_DEPARTMENT';
const EMP_TYPE_GENERAL_SECRETARY = 'GENERAL_SECRETARY';
const EMP_TYPE_CASH_DESK = 'CASH_DESK';
const EMP_TYPE_HUMAN_RESOURCES_DIRECTOR = 'HUMAN_RESOURCES_DIRECTOR';
const EMP_TYPE_CHIEF_DOCTOR = 'CHIEF_DOCTOR';
const EMP_TYPE_COMMERCIAL_DIRECTOR = 'COMMERCIAL_DIRECTOR';
const EMP_TYPE_ECOMMERCE_ASSISTANT = 'ECOMMERCE_ASSISTANT';
const EMP_TYPE_CONTACTS_APPOINTMENTS = 'CONTACTS_APPOINTMENTS';
const EMP_TYPE_GENERAL_MANAGER = 'GENERAL_MANAGER';
const EMP_TYPE_DEPUTY_GENERAL_MANAGER = 'DEPUTY_GENERAL_MANAGER';
const EMP_TYPE_WHOLESALE_EXTERNAL_SALES_MANAGER = 'WHOLESALE_EXTERNAL_SALES_MANAGER';
const EMP_TYPE_DISTRIBUTOR = 'DISTRIBUTOR';
const EMP_TYPE_AL_ASL_FOOD_INDUSTRIES = 'AL_ASL_FOOD_INDUSTRIES';
const EMP_TYPE_DRIVER = 'DRIVER';
// expense types
const EXP_TYPE_NORMAL = 'EXP_TYPE_NORMAL';
const EXP_TYPE_TRANSFER_TO_CENTRAL_ADMINISTRATION = 'EXP_TYPE_TRANSFER_TO_CENTRAL_ADMINISTRATION';
const EXP_TYPE_ENTERING_DISTRIBUTOR_TRANSACTION_MONEY = 'EXP_TYPE_ENTERING_DISTRIBUTOR_TRANSACTION_MONEY';
// message type
const MESSAGE_TYPE_REGULAR = 'regular';
const MESSAGE_TYPE_COMPLAIN = 'complain';
// certificates
const CERT_TARGET_PATIENT = 'CERT_TARGET_PATIENT'
const CERT_TARGET_EMPLOYEE = 'CERT_TARGET_EMPLOYEE'
// APT SPECIAL CASES
const CASE_PHONE_CLOSED = 'CASE_PHONE_CLOSED';
const CASE_PHONE_NO_ANSWER = 'CASE_PHONE_NO_ANSWER';
const CASE_POSTPONE_APT = 'CASE_POSTPONE_APT';
const CASE_CONFIRM_CANCEL_APT = 'CASE_CONFIRM_CANCEL_APT';
const CASE_CONFIRM_APT = 'CASE_CONFIRM_APT';
// group roles
const CHAT_GROUP_ADMIN = 'CHAT_GROUP_ADMIN'
const CHAT_GROUP_CONTRIBUTOR = 'CHAT_GROUP_CONTRIBUTOR'
// Chat Group Post Reactions
const CHAT_GROUP_POST_REACTIONS = {
	like: {
		code: 'like',
		color: '',
		icon: '<i class="xfb xfb-like js_fb_like_button_icon" data-code="like"></i>',
		url: '../assets/img/reactions/like.svg',
	},
	haha: {
		code: 'haha',
		color: 'text-color-care',
		icon: '<img src="../assets/img/reactions/haha.svg" class="width-18px height-18px js_fb_like_button_icon" data-code="haha">',
		url: '../assets/img/reactions/haha.svg',
	},
	love: {
		code: 'love',
		color: 'text-color-love',
		icon: '<img src="../assets/img/reactions/love.svg" class="width-18px height-18px js_fb_like_button_icon" data-code="love">',
		url: '../assets/img/reactions/love.svg',
	},
	sad: {
		code: 'sad',
		color: 'text-color-care',
		icon: '<img src="../assets/img/reactions/sad.svg" class="width-18px height-18px js_fb_like_button_icon" data-code="sad">',
		url: '../assets/img/reactions/sad.svg',
	},
	wow: {
		code: 'wow',
		color: 'text-color-care',
		icon: '<img src="../assets/img/reactions/wow.svg" class="width-18px height-18px js_fb_like_button_icon" data-code="wow">',
		url: '../assets/img/reactions/wow.svg',
	},
	care: {
		code: 'care',
		color: 'text-color-care',
		icon: '<img src="../assets/img/reactions/care.svg" class="width-18px height-18px js_fb_like_button_icon" data-code="care">',
		url: '../assets/img/reactions/care.svg',
	},
	angry: {
		code: 'angry',
		color: 'text-color-angry',
		icon: '<img src="../assets/img/reactions/angry.svg" class="width-18px height-18px js_fb_like_button_icon" data-code="angry">',
		url: '../assets/img/reactions/angry.svg',
	},
}

let reloadUserConfig
let loadIniSettings
let loadIniSettingsSync
let openDevTools
let loadDisplayLanguage
let PageLoader
let getUserConfig
let saveUserConfig
let deleteFile
let isConfigExists
let getConnectionHostname
let setConnectionHostname
let createWindow
let closeWindow
let indexDirFiles
let arrayToJson
let blobToFile
let bufferToBlob
let urlToBlob
let urlToFile
let xlsxToJson
let getRandomColor
let escapeArabic
let uploadFile
let uniqid
let checkJSON
let escapeJsonCharacters
let imgPlaceholder
let imgFallback
let formatDateTimeToDate
let syncImagesThread
let showInMap
let batchShowInMap
let fillForm
let lastArrayElement
let firstArrayElement
let receipt7_5cmPrint
let moneyFormat
let convertCoordinates
let checkContentEditableEmpty
let formatNumberToStr
let detectTypingEnd
let objectValues
let convertPptToImage
let setCursorAtEnd
let renderEjs
let openFile
let openFolder
let commerceMoney

// dispatched events
let dispatch_onNewAjaxContentLoaded
let dispatch_onRefreshGroupPosts

// Global
// extract extension from data url
function extractExtensionFromDataUrl(dataUrl) 
{
	const mimeTypeMatch = dataUrl.match(/^data:(.*?);/);
	if (mimeTypeMatch && mimeTypeMatch[1]) 
	{
		const mimeType = mimeTypeMatch[1];
		const extensionMatch = mimeType.match(/\/([a-zA-Z]+)/);
		if (extensionMatch && extensionMatch[1]) 
		{
			return extensionMatch[1];
		}
	}
	return null;
}
  
// rotate image
function rotateImage(imageUrl, degrees, callback) 
{
	const img = new Image();
	
	img.onload = function() {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		// Calculate the new dimensions to fit the rotated image
		const radians = (degrees * Math.PI) / 180;
		const width = img.width;
		const height = img.height;
		const newWidth = Math.abs(Math.cos(radians) * width) + Math.abs(Math.sin(radians) * height);
		const newHeight = Math.abs(Math.sin(radians) * width) + Math.abs(Math.cos(radians) * height);

		// Set the canvas dimensions
		canvas.width = newWidth;
		canvas.height = newHeight;

		// Rotate the image
		ctx.translate(newWidth / 2, newHeight / 2);
		ctx.rotate(radians);
		ctx.drawImage(img, -width / 2, -height / 2);

		// Convert the rotated canvas back to an image
		const rotatedImageUrl = canvas.toDataURL('image/png');

		// Call the callback function with the rotated image URL
		callback(rotatedImageUrl);
	};

	// Load the image
	img.src = imageUrl;
}
  
// Print to pdf
function printHTMLToPdf(printableElement = '', options = {})
{
	// A4 landscape 299mm X 220mm | margin: -4cm -4.9cm -4cm -5.3cm
	// A5 portrait 150mm X 206.5mm | margin: 0cm 0cm 0cm -1cm

	var width = (!options.width) ? $(window).width() : options.width
	var height = (!options.height) ? $(window).height() : options.height

	var top = (!options.top) ? 0 : options.top
	var left = (!options.left) ? 0 : options.left

	var page = {
		size: 'A4',
		margin: '0cm'
	}

	if ( options.page )
	{
		page.size = (options.page.size) ?? page.size
		page.margin = (options.page.margin) ?? page.margin
	}

	var printWindow = window.open('', '', `width=${ width }, height=${ height }, top=${top}, left=${left}`);
	// open the window
	printWindow.document.open();
	var domHTML = document.head.outerHTML;
	// console.log( domHTML )
	domHTML+= `<body style="padding: 1em 2em;" dir="${options.direction}">
					<style>
					
						@page {
							size: ${page.size};
							margin: ${page.margin};
						}		

					</style>
					${printableElement}
				</body>`;
	printWindow.document.write( domHTML );
	var winDomElement = $(printWindow.document);
	printWindow.document.close();
	printWindow.focus();
	printWindow.onload = (event) => 
	{
		setTimeout(function() {
			printWindow.print();
			printWindow.close();
		}, 2*1000);
	};
	/*
	setTimeout(function() {
        printWindow.print();
        printWindow.close();
    }, 2000);
    */
}

function printSourceUrl(url, options = {}) 
{
	var width = (!options.width) ? $(window).width() : options.width;
	var height = (!options.height) ? $(window).height() : options.height;
	var top = (!options.top) ? 0 : options.top;
	var left = (!options.left) ? 0 : options.left;

	const printWindow = window.open(url, '_blank', `width=${width}, height=${height}, top=${top}, left=${left}`);

	// Wait for the window to load
	printWindow.onload = (e) => {
		// Register the onbeforeprint event handler to trigger the print dialog
		printWindow.onbeforeprint = function() {
			printWindow.print();
		};

		// You can also use onafterprint to close the window after printing (optional)
		printWindow.onafterprint = function() {
			printWindow.close();
		};

		// Trigger the print dialog programmatically
		printWindow.focus();
		printWindow.print();
	};
}

function downloadFileWithProgress(url, filename, progressCallback) 
{
	// Set start time
	var DOWNLOAD_START_TIME = new Date().getTime();

	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'blob';

	xhr.upload.addEventListener('progress', function(e)
	{
		console.log(e.lengthComputable)
		if (e.lengthComputable) 
		{
			var percentComplete = (e.loaded / e.total) * 100;
			// Time Remaining
			var seconds_elapsed = ( new Date().getTime() - DOWNLOAD_START_TIME ) / 1000;
			bytes_per_second = e.loaded / seconds_elapsed;
			//var bytes_per_second = seconds_elapsed ? e.loaded / seconds_elapsed : 0 ;
			var timeleft = (new Date).getTime() - DOWNLOAD_START_TIME;
			timeleft = e.total - e.loaded;
			timeleft = timeleft / bytes_per_second;
			// Upload speed
			var Kbytes_per_second = bytes_per_second / 1024 ;
			var transferSpeed = Math.floor(Kbytes_per_second);
			// console.log(percentComplete)
			progressCallback({
				e,
				percentComplete,
				timeleft: timeleft.toFixed(0),
				transferSpeed,
			});
		}
	})

	xhr.onload = function () {
		if (xhr.status === 200) 
		{
			var reader = new FileReader();
			reader.readAsArrayBuffer( xhr.response );
			reader.onload = () =>
		    {
		    	var buffer = Buffer.from(reader.result);
		    	fs.writeFile( filename, buffer, (err) => 
		    	{
		    		if ( err )
		    		{
		    			console.error(err);
		    			return;
		    		}

		    		if ( typeof onComplete == 'function' )
		    			onComplete(filename);
		    	});
		    };
		}
	};

	xhr.send();

	return xhr
}

$(async function()
{
//
// commerceMoney
commerceMoney = (value) =>
{
	return value+' '+FUI_DISPLAY_LANG.views.pages.global.currency
}
// Open folder
openFolder = (folder_path) =>
{
	const childProcess = require('child_process')
	
	result = childProcess.exec( 'start \"\" \"'+folder_path+'\"', (err, stdout, stderr) => {} );
	return result;
}
// Open file
openFile = (filepath) =>
{
	const childProcess = require('child_process')
	
	result = childProcess.exec( '\"'+filepath+'\"', (err, stdout, stderr) => {});
	return result;
}
// render ejs
renderEjs = (path, data = {}) =>
{
	const ejs = require('ejs')

	return new Promise((resolve, reject) =>
	{
		ejs.renderFile(path, data,(err,html) =>
		{
			if ( err )
			{
				reject(err)
				return
			}
			resolve(html)
		})
	})
}
// setCursorAtEnd
setCursorAtEnd = (element) => 
{
	// element[0].focus()

	// const end = element.html().length

	// element[0].setSelectionRange(end, end)
	// console.log(end)
	// element[0].focus()

	element[0].focus()
	let sel = window.getSelection();
    sel.selectAllChildren(element[0]);
    sel.collapseToEnd();
}
  
convertPptToImage = (file, callback) =>
{
	var CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');
	var defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;

	// Configure API key authorization: Apikey
	var Apikey = defaultClient.authentications['Apikey'];
	Apikey.apiKey = '480d3bcb-2d38-4ae4-b8ce-405b21e381cc';



	var apiInstance = new CloudmersiveConvertApiClient.ConvertDocumentApi();

	var inputFile = Buffer.from(fs.readFileSync(file.path).buffer); // File | Input file to perform the operation on.

	apiInstance.convertDocumentPptxToPng(inputFile, (error, data, response) =>
	{
		callback(error, data, response)
	});

}
// objectValues
objectValues = (object, delim = ' ') => 
{
	var values = ''

	for (const key in object) 
	{
		values += object[key] + delim
	}

	return
}
// detectTypingEnd
detectTypingEnd = (inputElement, callback, delay = 500) => 
{
	let typingTimer
	$(inputElement).off('keyup keydown input');

	$(inputElement).on('keyup', function() 
	{
		clearTimeout(typingTimer);
		typingTimer = setTimeout(function() 
		{
			callback($(inputElement).val());
		}, delay);
	});

	$(inputElement).on('keydown', function() 
	{
		clearTimeout(typingTimer);
	});

	$(inputElement).on('input', function() 
	{
		clearTimeout(typingTimer);
	});
}
// formatNumberToStr
//format Number To Str
formatNumberToStr = (num) =>
{
	if ( num == 1000000 )
	{
		num = (num / 1000000).toFixed(0)+'m';
	}
	else if ( num > 1000000 )
	{
		num = (num / 1000000).toFixed(1)+'m';
	}
	else if ( num == 1000 )
	{
		num = (num / 1000).toFixed(0)+'k';
	}
	else if ( num > 1000 )
	{
		num = (num / 1000).toFixed(1)+'k';
	}

	return num;
}
//
checkContentEditableEmpty = (element) =>
	{
		divHtml = element.html();
		checkEmpty = divHtml.replace(' ', '').replace('<br>', '');
		if(checkEmpty.length == 0){
			return true
		}
		else return false;
}

// convertCoordinates
convertCoordinates = (coords, type = 'string') =>
{
	let result
	if ( type == 'string' )
	{
		result = `${coords.lat},${coords.lng}`
	}
	else if ( type == 'object' )
	{
		const [lat, lng] = coords.split(',').map(parseFloat)
		result = {lat,lng}
	}

	return result
}
// money format
moneyFormat = (amount, options = {}) =>
{
	if ( typeof amount == 'string' )
		amount = parseFloat(amount)
		
	const defaultOptions = {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
		locale: 'en-US',
	}

	var allOptions = {...defaultOptions, ...options}
	return amount.toLocaleString(allOptions.locale, allOptions);
}
// print receipt 7.5 cm print
printInvoice = async (options = {}) =>
{
	const defaultOptions = {
		class: 'RECEIPT_7_5_CM_PRINT',
	}

	const newOptions = {...defaultOptions, ...options}

	var data = newOptions.data
	var printable_invoice = createFakeElement('FAKE_CONTAINER', await(getPage('../views/prints/center-client-invoice-page.ejs')))
									.find('.printable_invoice')

	printable_invoice.addClass(newOptions.class)
	printable_invoice.find('#center_name').text( data.supplier_name )
	printable_invoice.find('#invoice_number').text( data.order_hash )
	printable_invoice.find('#invoice_date').text( data.order_date )
	printable_invoice.find('#client_name').text( data.order_receiver_name )

	if ( !data.order_items ) return

	var html = ''
	var order_items_total_quantity = 0
	$.each(data.order_items, (k,v) =>
	{
		order_items_total_quantity+= parseInt(v.order_item_quantity)
		html += `<tr>
					<td class="has-text-right">
						<div class="mb-2">${v.item_name}</div>
						<div>${v.item_info.productDesc}</div>
					</td>
					<td>${v.order_item_quantity}</td>
					<td>${v.order_item_price}</td>
					<td>${v.order_item_final_amount}</td>
				</tr>`
	})

	html += `<tr>
				<td colspan="2">
					<b>المجموع</b>
				</td>
				<td colspan="2">
					${data.order_total_amount}
				</td>
			</tr>`

	printable_invoice.find('#invoice_products_table tbody').html(html)
	printable_invoice.find('#invoice_total_items').text(data.order_items.length)
	printable_invoice.find('#invoice_total_items_quantity').text(order_items_total_quantity)

	printHTMLToPdf( printable_invoice[0].outerHTML , {
		width: 0,
		height: 0,
		top: 10000,
		left: 10000,
		page: {
			size: '0 7.5cm',
			margin: '0cm'
		}
	} )
}
// first array element
firstArrayElement = (array) => 
{
	return array[0]
}
// last array element
lastArrayElement = (array) => 
{
	return array[array.length-1]
}
// fill form
fillForm = (formElement, options) => 
{
	// Iterate over each form field
	$(formElement).find('input, textarea, select').each(function() 
	{
		const fieldName = $(this).attr('name');

		// Check if the field name exists in the options data object
		if (fieldName && options.hasOwnProperty(fieldName)) 
		{
			const fieldValue = options[fieldName];

			// Fill the form field based on its type
			const fieldType = $(this).attr('type');
			if (fieldType === 'checkbox' || fieldType === 'radio') 
			{
				// For checkboxes and radio buttons, check the value if it matches
				$(this).prop('checked', fieldValue === $(this).val());
			} 
			else if (fieldType === 'select-multiple') 
			{
				// For multi-select fields, select options based on an array of values
				const fieldValuesArray = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
				$(this).find('option').each(function() {
					$(this).prop('selected', fieldValuesArray.includes($(this).val()));
				});
			} 
			else 
			{
				// For other field types (text, textarea, select), set the value directly
				$(this).val(fieldValue);
			}
		}
	});
};
batchShowInMap = (mapElement, points) => 
{
	// Create a new map instance
	const map = new google.maps.Map(mapElement, {
		center: points[0].coordinates,
		zoom: 6,
	});

	// Add markers for each point
	points.forEach((point) => 
	{
		const marker = new google.maps.Marker({
			position: point.coordinates,
			map: map,
		});

		// Add click event listener to zoom in when clicked
		marker.addListener("click", () => 
		{
			map.setCenter(point.coordinates);
			map.setZoom(10);
		});
	});
};
  
//showInMap
showInMap = (mapElement, options = {}) => 
{
	// Default coordinates and zoom values
	const defaultOptions = {
		coordinates: { lat: 28.0339, lng: 1.6596 },
		zoom: 10,
	}

	const mapOptions = {...defaultOptions, ...options}

	// Create a new map instance
	const map = new google.maps.Map(mapElement, {
		center: mapOptions.coordinates,
		zoom: mapOptions.zoom,
	});

	// Add a marker to the map
	new google.maps.Marker({
		position: mapOptions.coordinates,
		map: map,
	});
};
  
	  
// syncImagesThread
syncImagesThread = () =>
{
	if ( !DEFAULT_INI_SETTINGS ) return
	// check if enabled
	if ( DEFAULT_INI_SETTINGS.General_Settings )
	{
		if ( DEFAULT_INI_SETTINGS.General_Settings.PATIENT_IMAGES_SYNC )
		{
			// weight images
			if ( DEFAULT_INI_SETTINGS.General_Settings.PATIENT_IMAGES_PATH != '' )
			{
				var upload_weight_images_worker = new Worker('../assets/js/workers/UploadPatientImagesWorker.js')
				upload_weight_images_worker.postMessage({
					date_time: {
						CURRENT_DATE:CURRENT_DATE,
						CURRENT_TIME:CURRENT_TIME,
					},
					USER_CONFIG: USER_CONFIG,
					DEFAULT_INI_SETTINGS: DEFAULT_INI_SETTINGS,
				})
			}
			
		}
	}
	// 
}
// formatDateTimeToDate
formatDateTimeToDate = (datetime) => 
{
	const formattedDate = date_time.format(new Date(datetime), 'YYYY-MM-DD');
	return formattedDate;
}
// imgFallback
imgPlaceholder = (placeholder = '../assets/img/utils/placeholder.jpg') => 
{
	return placeholder;
} 
// imgFallback
imgFallback = (imageUrl, fallbackUrl) => 
{
	const defaultFallbackUrl = '../assets/img/utils/placeholder.jpg';
	
	if (!imageUrl || imageUrl.trim() === '') 
	{
		if (fallbackUrl && fallbackUrl.trim() !== '') 
		{
			return fallbackUrl;
		} 
		else {
			return defaultFallbackUrl;
		}
	}
	
	return imageUrl;
}  
// escapeJsonCharacters
escapeJsonCharacters = (data) => 
{
	return JSON.stringify(data, function (key, value) 
	{
		if (typeof value === "string") 
		{
			return value.replace(/'/g, "\\'")
		}
		return value
	});
}
// checkJSON
checkJSON = (data) => 
{
	try 
	{
		JSON.parse(data)
		return JSON.parse(data)
	} catch 
	{
		return data
	}
}
// Unique id
uniqid = () =>
{
	return uuid.v4();
}
// Upload files
uploadFile = (url ,file, progress, beforeUpload) =>
{
	let UPLOAD_START_TIME;

	var request = $.ajax({
	    xhr: function() 
	    {
	        var xhr = new XMLHttpRequest();
	        var lastNow = new Date().getTime();
			var lastKBytes = 0;
	        xhr.upload.addEventListener("progress", (e) =>
	        {
	            if (e.lengthComputable) 
	            {
	                var percentComplete = (e.loaded / e.total) * 100;
	                // Time Remaining
	                var seconds_elapsed = ( new Date().getTime() - UPLOAD_START_TIME ) / 1000;
	                bytes_per_second = e.loaded / seconds_elapsed;
	                //var bytes_per_second = seconds_elapsed ? e.loaded / seconds_elapsed : 0 ;
	                var timeleft = (new Date).getTime() - UPLOAD_START_TIME;
	                timeleft = e.total - e.loaded;
	                timeleft = timeleft / bytes_per_second;
	                // Upload speed
	                var Kbytes_per_second = bytes_per_second / 1024 ;
	                var transferSpeed = Math.floor(Kbytes_per_second);

	                progress(e, timeleft.toFixed(0), transferSpeed, percentComplete);
	            }
	        }, false);
	        return xhr;
	    },
	    type: 'POST',
	    contentType: false,
	    processData: false,
	    url: url,
	    data: file,
	    beforeSend: function(e)
	    {
	    	// Set start time
			UPLOAD_START_TIME = new Date().getTime();
	    	beforeUpload(e);
	    }
	});
	// Add request
	addUploadRequest(request);
	return request;
}
escapeArabic = (text) => 
{
	var result = '';
	for (var i = 0; i < text.length; i++) {
		var charCode = text.charCodeAt(i);
		if (charCode >= 0x0600 && charCode <= 0x06FF) {
			result += '\\u' + ('000' + charCode.toString(16)).slice(-4);
		} else {
			result += text[i];
		}
	}
	return result;
}

getRandomColor = () => 
{
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}

	return color;
}
// urlToFile
urlToFile = async (url, options = {}) =>
{
	const blob = await urlToBlob(url)

	return blobToFile(blob, (options.file) ? options.file.name : '')
}
// urlToBlob
urlToBlob = async (url) =>
{
	var res = await fetch(url)
	
	return await res.blob()
}
// buffer to blob
bufferToBlob = (buffer, options) =>
{
	return new Blob([buffer], options);
}
// blob to file
blobToFile = (blob, filename) =>
{
	const file = new File([blob], filename, {
		type: blob.type,
		lastModified: new Date()
	});

	return file;
}
// xlsx to json
xlsxToJson = (file_object, callback) =>
{
	var XLSX = require("xlsx");
    var mime = require('mime-types')
	var Papa = require('papaparse')

    const csv_file = APP_TMP_DIR+'/docs/csv/'+uuid.v4()+'.csv'
    
    // make dir if not exists
    if ( !fs.existsSync( path.dirname(csv_file) ) )
		fs.mkdirSync( path.dirname(csv_file) , {recursive: true});

    var data = XLSX.readFileSync(file_object.path)
    // save as csv
    XLSX.writeFileSync(data, csv_file, { bookType: "csv" })
    
    // read file as buffer 
    var buffer = fs.readFileSync(csv_file)
    // convert to blob
    // var blob = bufferToBlob(buffer, {
    //     type: mime.lookup(csv_file)
    // })
    // convert to File object
    var file = blobToFile(buffer, path.basename(csv_file))
  
    Papa.parse(file, 
	{
		download: false,
		worker: true,
		encoding: "UTF-8",
		error: (err, file, inputElem, reason) =>
		{
			console.log(err);
		},
		complete: async (response) =>
		{
			var data = response.data;
			data = data.filter( (val) => val != '' )
            callback(arrayToJson(data))
		}
	})
}
// arrayToJson
arrayToJson = (array) => 
{
	if (!array || array.length === 0) {
	  return {
		cols: [],
		rows: [],
		json: []
	  };
	}
  
	const [cols, ...rows] = array;
  
	const json = rows.map((row) => {
	  return cols.reduce((acc, col, index) => {
		acc[col] = row[index];
		return acc;
	  }, {});
	});
  
	return { cols, rows, json };
}
  
// indexDirFiles
indexDirFiles = (dir, options = {}) =>
{
	var files = fs.readdirSync(dir, options)
	var results = {
		fullpaths: [],
		names: [],
		clean_names: [],
	}

	if ( files.length == 0 ) return results

	results.fullpaths = files.map( (val) => dir+'/'+val )
	results.names = files
	results.clean_names = files.map( (val) => path.parse(val).name )
	return results
}
// close Window
closeWindow = (name) =>
{
	ipcIndexRenderer.send('close-window', {
		name: name
	});
}
// create window
createWindow = (options = null, callback = null) =>
{
	ipcIndexRenderer.send('create-window', {
		options: options
	});
	if ( typeof callback == 'function' )
	{
		ipcIndexRenderer.removeAllListeners('window-created');
		ipcIndexRenderer.on('window-created', args =>
		{
			callback(args)
		})	
	}
	
}
// Set containers disabled
setContainersDisabled = (disabled = false) =>
{
	if ( disabled )
	{
		MAIN_CONTENT_CONTAINER.addClass('disabled');
		SIDE_NAV_CONTAINER.addClass('disabled');
		TOP_NAV_BAR.addClass('disabled');
	}
	else
	{
		MAIN_CONTENT_CONTAINER.removeClass('disabled');
		SIDE_NAV_CONTAINER.removeClass('disabled');
		TOP_NAV_BAR.removeClass('disabled');
	}
}
//Save user data
saveUserConfig = (json, CALLBACK) =>
{
	var dir = path.dirname(USER_CONFIG_FILE);
	if ( !fs.existsSync(dir) )
		fs.mkdirSync(dir, {recursive: true});

	data = JSON.stringify(json);
	fs.writeFile(USER_CONFIG_FILE, data, (error) => 
	{
		if ( typeof CALLBACK == 'function' )
			CALLBACK(error);

		// reload User Config
		reloadUserConfig();
	});
}
// Delete file
deleteFile = (file, CALLBACK) =>
{
	if (fs.existsSync(file)) 
	{
		fs.unlink(file, (error) =>
		{
			CALLBACK(error);
		});
  	}
}

// Get user data
getUserConfig = () =>
{
	if ( !isConfigExists() )
		return null;
	config = fs.readFileSync(USER_CONFIG_FILE, 'utf-8');
	json = JSON.parse(config);
	return json;
}
// Check config file exists
isConfigExists = () =>
{
	// console.log(USER_CONFIG_FILE);
	exists = false;
	if ( fs.existsSync(USER_CONFIG_FILE) )
		exists = true;

	return exists;
}
// Get connection hostname
getConnectionHostname = () =>
{
	var settings = loadIniSettingsSync();

	if ( !settings )
		return 'localhost';

	if ( settings.Server_Settings == null )
		return 'localhost';

	return settings.Server_Settings.HOSTNAME;

}
// Set connection hostname
setConnectionHostname = (hostname) =>
{
	var fini = new IniFile(APP_ROOT_PATH);

	var Server_Settings = {
		HOSTNAME: $.trim(hostname)
	};

	fini.writeSync(SETTINGS_FILE, Server_Settings, 'Server_Settings');
	setupAPISettings();
}
// Page Loader
PageLoader = (visible = true) =>
{
	var PAGE_LOADER = $('#PAGE_LOADER');

	if ( visible )
		PAGE_LOADER.fadeIn(200);
	else
		PAGE_LOADER.fadeOut(200);
}
// Load display language
loadDisplayLanguage = () =>
{
	
	if ( fs.existsSync(DISPLAY_LANG_FILE) )
	{
		var data = fs.readFileSync(DISPLAY_LANG_FILE).toString('utf-8');
		FUI_DISPLAY_LANG = JSON.parse(data);
	}
	
	/*
	return new Promise(resolve =>
	{
		ipcIndexRenderer.removeAllListeners('translation-file-created');
		ipcIndexRenderer.on('translation-file-created', (e,info) =>
		{
			FUI_DISPLAY_LANG = info;
			resolve(info);
		});	
	});	
	*/
}
// open dev tools
openDevTools = () =>
{
	// window key press
	var winkeys = {}
	$(window).off('keydown')
	.on('keydown', e =>
	{
		winkeys[e.code] = e.type == 'keydown'
	
		if ( winkeys.ControlLeft 
			&& winkeys.ShiftLeft 
			&& winkeys.KeyI
		)
		{
			ipcIndexRenderer.send('open-dev-console', '')
			winkeys = {}
		}
	})
}
// Load ini settings
loadIniSettings = (CALLBACK) =>
{
	var fini = new IniFile(APP_TMP_DIR+'/');
	fini.read(SETTINGS_FILE).then(data =>
	{
		CALLBACK(data);
	});
}
// Load ini settings sync
loadIniSettingsSync = () =>
{
	var fini = new IniFile(APP_TMP_DIR+'/');
	DEFAULT_INI_SETTINGS = fini.readSync(SETTINGS_FILE);
	return DEFAULT_INI_SETTINGS;
}
// reload user config
reloadUserConfig = () =>
{
	var data = getUserConfig()
	USER_CONFIG = (data) ?? {}
	// sessionStorage.setItem('USER_CONFIG', JSON.stringify(USER_CONFIG))
}

// dispatched events //
// dispatch_onRefreshGroupPosts
dispatch_onRefreshGroupPosts = (data = {}) => 
{
	var onRefreshGroupPosts = new CustomEvent('refresh-group-posts', { 
		detail: data 
	});
	document.dispatchEvent(onRefreshGroupPosts)
}
// dispatch_onNewAjaxContentLoaded
dispatch_onNewAjaxContentLoaded = (data = {}) =>
{
	var onNewAjaxContentLoaded = new CustomEvent('new-ajax-content-loaded', { 
		detail: data 
	});
	document.dispatchEvent(onNewAjaxContentLoaded)
}


// Call Globally
loadDisplayLanguage();
//
reloadUserConfig();
// load ini settings
loadIniSettingsSync();
API_END_POINT = DEFAULT_INI_SETTINGS.Server_Settings.API_END_POINT;
PROJECT_URL = DEFAULT_INI_SETTINGS.Server_Settings.PROJECT_URL;
// dev console
openDevTools()


})