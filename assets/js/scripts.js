$(async function()
{



checker_2_sec()
// 2 sec checker
function checker_2_sec()
{
	setInterval(() => 
	{
		
		// add table-element class to all tables
		$('table').addClass('table-element')
		$('.utable').addClass('table-element')
		// initialize select all on checkboxes
		$('.table-element').each((k,element) =>
		{
			var table_element = $(element)
			// add select-all-trigger data to all tables first col in thdead
			table_element.find('thead tr th').first().data('role', 'select-all-trigger').attr('data-role', 'select-all-trigger').css('cursor', 'pointer')
			table_element.find('.thead .td').first().data('role', 'select-all-trigger').attr('data-role', 'select-all-trigger').css('cursor', 'pointer')
			var thead = (table_element.find('thead').length > 0) ? table_element.find('thead') : table_element.find('.thead')

			thead.off('click').on('click', e =>
			{
				var target = $(e.target)

				if ( target.data('role') == 'select-all-trigger' )
				{
					// find first tbody tr col checkboxes
					var checkboxes = table_element.find('tbody tr td input[type="checkbox"]')
					if ( checkboxes.length == 0 ) checkboxes = table_element.find('.tbody .tr .td input[type="checkbox"]')

					toggleCheck(checkboxes)
				}
			})
		})

		// panel toggler button
		$('.panel_toggler_button').each((k,element) =>
		{
			var toggler_button = $(element)

			toggler_button.off('click').on('click', e =>
			{
				e.preventDefault()

				var target = $(toggler_button.data('target'))

				target.toggleClass('d-none')
			})
		})
		// panel close button
		$('.panel_toggler_button_panel_close').each((k,element) =>
		{
			var toggler_button = $(element)

			toggler_button.off('click').on('click', e =>
			{
				e.preventDefault()

				var target = $(toggler_button.data('target'))

				target.addClass('d-none')
			})
		})

		// close notifications
		$('.notification-close').each((k,element) =>
		{
			var $parent = element.closest('.notification');
			
			$(element).off('click').on('click', e =>
			{ 
				$parent.remove();
			});
		});

	}, 2*1000);
}
checker_20_sec()
// Setup auto checker
function checker_20_sec()
{

	if ( !USER_CONFIG ) return
	if ( Object.keys(USER_CONFIG).length == 0 ) return
	// messages 
	var delay = 20;
	setInterval(async () => 
	{
		// messages private
		MESSAGE_MODEL.inbox({
			userHash: USER_CONFIG.employee_hash,
			isRead: 0
		}).then(res =>
		{
			if (res.code == 404)
				return;

			// dispatch bell ringing message
			var onNewMessagesFound = new CustomEvent('new-messages-found', { 
				detail: { 
					data: res.data,
					USER_CONFIG: USER_CONFIG,
				} 
			});
			document.dispatchEvent(onNewMessagesFound)
		});
		// list replies
		MESSAGE_MODEL.replies({
			userHash: USER_CONFIG.employee_hash,
			folder: 'inbox',
			isNotified: ST_NO
		}).then(res =>
		{
			if (res.code == 404)
				return;

			// dispatch bell ringing message
			var onNewMessagesFound = new CustomEvent('new-message-replies-found', { 
				detail: { 
					data: res.data,
					USER_CONFIG: USER_CONFIG,
				} 
			});
			document.dispatchEvent(onNewMessagesFound)
		});
		// notifications
		NOTIFICATION_MODEL.receiver_isRead_count({
			receiver_id: USER_CONFIG.employee_id,
            receiver_type_code: 'employees',
			is_read: ST_NO,
		}).then(res =>
		{
			// dispatch new-notifications-found
			var onNewNotificationsFound = new CustomEvent('new-notifications-found', { 
				detail: { 
					data: res.data,
					USER_CONFIG: USER_CONFIG,
				} 
			});
			document.dispatchEvent(onNewNotificationsFound)
		})

	}, delay * 1000);
	
}
// 5 sec checker
checker_5_sec()
function checker_5_sec()
{
	setInterval(async () => 
	{
		// ringing bell
		RINGING_BELL_MODEL.last_today({
			administration_id: USER_CONFIG.administration.clinicId,
			employee_type_id: USER_CONFIG.employee_type_id
		}).then(res =>
		{
			if ( res.code == 200 )
			{
				ringin_bell_data = res.data
				// dispatch bell ringing message
				var onRingingBellFound = new CustomEvent('ringing-bell-found', { 
					detail: { 
						data: ringin_bell_data,
						USER_CONFIG: USER_CONFIG,
					} 
				});
				document.dispatchEvent(onRingingBellFound)
			}	
		})

	}, 5*1000);
}
// 1 sec checker
checker_1_sec()
function checker_1_sec()
{
	setInterval(() => 
	{
		var currentTime = date_time.format(new Date(), 'HH:mm:ss');
		// setup permissions
		setupPermissions();

		// update input[type="time"] in real time

		$('input[type="time"]').each((k,element) =>
		{
			const input = $(element)
			
			input.val(currentTime)
		})

	}, 1*1000);
}
localizationUI()
// localisation
function localizationUI()
{
	if ( !FUI_DISPLAY_LANG ) return
	if ( Object.keys(FUI_DISPLAY_LANG).length == 0 ) return
	// replace with files that has proper interface
	if ( FUI_DISPLAY_LANG.lang == 'ar' )
	{
		// change style sheet
		$('head').append('<link rel="stylesheet" type="text/css" class="MAIN_STYLESHEET" href="../assets/css/main_ar.css">');
		setTimeout(() => {
			$($('.MAIN_STYLESHEET')[0]).remove();
		}, 0);
		// change pagination scripts
		// $('#PAGINATION').remove();
		// $('body').append('<script type="text/javascript" id="PAGINATION" src="../assets/js/pagination_ar.js"></script>');
	}
	else if ( FUI_DISPLAY_LANG.lang == 'fr' )
	{
		// change style sheet
		$('head').append('<link rel="stylesheet" type="text/css" class="MAIN_STYLESHEET" href="../assets/css/main_fr.css">');
		setTimeout(() => {
			$($('.MAIN_STYLESHEET')[0]).remove();
		}, 0);
		// change pagination scripts
		// $('#PAGINATION').remove();
		// $('body').append('<script type="text/javascript" id="PAGINATION" src="../assets/js/pagination_fr.js"></script>');
	}
}
// new-messages-found
$(document).off('new-messages-found').on('new-messages-found', e =>
{
	var detail = e.originalEvent.detail

	var MESSAGES_BADGE = SIDE_NAV_CONTAINER.find('#MESSAGES_BADGE')
	MESSAGES_BADGE.text( trimNumber(detail.data.length) )
	CreateToast('PS', FUI_DISPLAY_LANG.views.messages.you_have_new_unread_messages)
})
// new-message-replies-found
$(document).off('new-message-replies-found').on('new-message-replies-found', e =>
{
	var detail = e.originalEvent.detail

	var MESSAGES_BADGE = SIDE_NAV_CONTAINER.find('#MESSAGES_BADGE')
	MESSAGES_BADGE.text( trimNumber(detail.data.length) )
	CreateToast('PS', FUI_DISPLAY_LANG.views.messages.you_have_new_unread_message_replies)
})
// ringing-bell-found
$(document).off('ringing-bell-found').on('ringing-bell-found', async e =>
{
	var detail = e.originalEvent.detail
	
	console.log(detail)
	const DataURI = require('../assets/js/include/DataURI');
	var ringin_bell_data = detail.data

	var ringing_bell_id = "ringing_bell_audio_element_be298c6490c13d98294f84a3e52a42f8"
	var ringing_bell_audio_element = $('#'+ringing_bell_id)
	var ringing_bell_audio_html = `<audio src="" id="${ringing_bell_id}"></audio>`

	var stop_bell_button_id = 'stop_ringing_bell_button_be298c6490c13d98294f84a3e52a42f8'
	var stop_bell_button_element = $('#'+stop_bell_button_id)
	var stop_bell_button_html = `<a class="stop-bell-button d-none" id="${stop_bell_button_id}">
									<img src="../assets/img/utils/stop-bell-ringing.png" class="img-fluid" alt="">
								</a>`

	// show toast
	CreateToast('PS', ringin_bell_data.settings.TEXT_MESSAGE, ringin_bell_data.triggered_by_name, 3500*1000);

	// append stop bell button
	if ( !stop_bell_button_element[0] )
	{
		$(stop_bell_button_html).insertBefore(MAIN_CONTENT_CONTAINER)
		stop_bell_button_element = $('#'+stop_bell_button_id)
	}
	// show stop bell button
	stop_bell_button_element.removeClass('d-none')
	//
	stop_bell_button_element.off('click').on('click', e =>
	{
		e.preventDefault()

		if ( !ringing_bell_audio_element[0] ) return

		//check if still playing
		if ( !ringing_bell_audio_element[0].paused )
		{
			ringing_bell_audio_element[0].pause()
			ringing_bell_audio_element[0].currentTime = 0
			ringin_bell_data = null
		}
		stop_bell_button_element.addClass('d-none')
	})

	// hide stop bell button
	if ( ringin_bell_data ) 
	{
		// stop_bell_button_element.addClass('d-none')

		// check it is current target employee type
		if ( USER_CONFIG.employee_type_id == ringin_bell_data.employee_type_id )
		{
			if ( !ringing_bell_audio_element[0] )
			{
				$(ringing_bell_audio_html).insertBefore(MAIN_CONTENT_CONTAINER)
				ringing_bell_audio_element = $('#'+ringing_bell_id)
			}
			// set loop
			ringing_bell_audio_element[0].loop = true
			// check if source empty
			if ( ringing_bell_audio_element.attr('src') == '' )
				ringing_bell_audio_element.attr('src', DataURI.RINGING_BELL_AUDIO)

			//check if still playing
			if ( ringing_bell_audio_element[0].paused )
			{
				ringing_bell_audio_element[0].play()	
			}
			// set timeout end
			setTimeout(() => 
			{
				
				ringing_bell_audio_element[0].pause()
				ringing_bell_audio_element[0].currentTime = 0
				ringin_bell_data = null

			}, parseInt(ringin_bell_data.settings.DELAY_TIMEOUT)*1000);
		}

	}
})
// new-ajax-content-loaded
$(document).off('new-ajax-content-loaded').on('new-ajax-content-loaded', e =>
{
	var detail = e.originalEvent.detail

	setupPermissions();

	// js_list_tabs_navs
	$('.js_list_tabs_navs').each((k, element) =>
	{
		var list = $(element)

		list.off('click').on('click', e =>
		{
			var target = $(e.target)

			if ( target[0].nodeName == 'LI' )
			{
				var tab = $(target.data('target'))

				tab.slideDown(200).siblings('[data-role="tab_content"]').slideUp(200)
				target.addClass('active').siblings().removeClass('active')
				// dispatch tab changed event
				var onTabChanged = new CustomEvent('tab-changed', { 
					detail: { 
						tab: {
							id: tab.attr('id'),
							classes: tab.attr('class').split(' ')
						},
						USER_CONFIG: USER_CONFIG,
					} 
				});
				list[0].dispatchEvent(onTabChanged)
			}
		})
	})

	// croppable images
	$('[data-croppable="true"]').each((k, element) =>
	{
		var image = $(element)

		// append a "crop image" button or link after
		var crop_image_button_class = 'js_crop_image_button_'
		var crop_image_button = image.next()
		if ( !crop_image_button[0] )
		{
			if ( !image.hasClass('d-none') )
				$(`<a href="#" class="${crop_image_button_class} d-block">${FUI_DISPLAY_LANG.views.pages.global.crop_image_button}<a>`).insertAfter(image)
		}

		crop_image_button = image.next()

		crop_image_button.off('click').on('click', e =>
		{
			e.preventDefault()

			var testImg = new Image()

			testImg.src = image.attr('src')

			testImg.addEventListener('load', e =>
			{
				ImageCropperDialog({
					url: image.attr('src'),
					// maxSize : [testImg.width, testImg.height],
				}, data =>
				{
					image.attr('src', data.url)
					
				})
			})
		})
	})

	// set custom area-placeholder
	$('.js_has_area_placeholder').each((k,v) =>
	{
		const element = $(v)
		var placeholder = `<p class="js_content_editable_placeholder fw-300 no-pointer" style="color: #767676;">${element.attr('area-placeholder')}</p>`

		if ( !element.is(':focus') )
		{
			if ( checkContentEditableEmpty(element) ) element.html(placeholder)
		}

		element.on('focus',e =>
		{
			var js_content_editable_placeholder = element.find('.js_content_editable_placeholder')

			if ( !js_content_editable_placeholder[0] ) return

			js_content_editable_placeholder.remove()

			element[0].focus()
		})
		.on('blur',e =>
		{
			if ( checkContentEditableEmpty(element) )
			{
				element.html(placeholder)
				return
			}
		})
	})

	// preview selected files in file input
	$('.js_file_input_previewable').each((k,v) =>
	{
		const element = $(v)

		element.on('change', async e =>
		{
			if ( element[0].files.length == 0 ) return

			var previewTarget = $(element.data('preview-target'))
			var dataURL = await imageToDataURL(element[0].files[0])

			previewTarget.attr('src', dataURL).removeClass('d-none')
			dispatch_onNewAjaxContentLoaded()
		})
	})

	// preview images
	$('.js_img_previewable').each((k,v) =>
	{
		const img = $(v)
		img.addClass('cursor-pointer pointer')

		img.on('click', async e =>
		{
			PreviewFileDialog({
                url: img.attr('src')
            }, edited =>
			{
				img.attr('src', edited.url)
			});
		})
	})

	// set image alt src
	$('.js_image_src_placeholder').each((k,v) =>
	{
		const element = $(v)

		if ( element.attr('src') == '' || !element.attr('src') || element.attr('src') == undefined )
		{
			var img = new Image

			img.src = element.data('placeholder')
			img.addEventListener('load', e =>
			{
				var canvas = document.createElement('canvas')
				var ctx = canvas.getContext('2d')

				canvas.width = img.width
				canvas.height = img.height

				ctx.drawImage(img, 0,0)

				element.attr('src', canvas.toDataURL() )
			})
			
		}
	})

	// print source url
	$('.js_trigger_print_source_url_dialog').each((k,v) =>
	{
		const element = $(v)

		element.off('click').on('click', e =>
		{
			e.preventDefault()
			if ( element[0].nodeName == 'A' )
			{
				const url = element.attr('href')

				if ( isImageFile(url) )
				{
					var style = `
								display: block;
								-webkit-user-select: none;
								margin: auto;
								background-color: hsl(0, 0%, 90%);
								transition: background-color 300ms;
								overflow-clip-margin: content-box;
								overflow: clip;
								max-width: 100%;
								max-height: 100%;`
					var html = `<img src="${url}" style="${style}">`

					printHTMLToPdf(html, {
						width: 0,
						height: 0,
						top: 10000,
						left: 10000,
					})
				}	
			}
		})
	})

	// add progress bar after each file input
	$('.js_file_input_has_progress').each((k,v) =>
	{
		const input = $(v)

		var html = `<div class="progress d-none">
						<div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">0%</div>
					</div>`
		//
		if ( input.next().hasClass('progress') ) return
		$(html).insertAfter(input)
	})

	// panel toggler
	$('.js_panel_toggler_button').each((k,v) =>
	{
		const button = $(v)

		button.on('click', e =>
		{
			const target = $(button.data('target'))

			target.removeClass('d-none')
			// dispatch open event
			var onPanelOpened = new CustomEvent('panel:opened', { 
				detail: { 
					panel: target,
					trigger: button,
				} 
			});
			document.dispatchEvent(onPanelOpened)
		})
	})
	// panel close
	$('.js_panel_close_button').each((k,v) =>
	{
		const button = $(v)

		button.on('click', e =>
		{
			const target = $(button.data('target'))

			target.addClass('d-none')
		})
	})

})

// $.ajax({
// 	url: 'http://127.0.0.1:8000/api/users/media/shared-with-me/delete',
// 	type: 'POST',
// 	data: {
// 		sharer_id: 28,
// 		shared_with_id: 27,
// 		media_id: 11,
// 		permissions: ['download', 'read']
// 	},
// 	success: function(res)
// 	{
// 		console.log(res)
// 	},
// 	error: function(xhr)
// 	{
// 		console.error(xhr)
// 	}
// })

// $.ajax({
// 	url: 'https://docteur-aoun.com/api/Orders/Direction/DistributorToClientSellingInvoice/Clients/local_search',
// 	type: 'POST',
// 	data: {
// 		query: '',
// 		user_id: 29

// 	},
// 	success: function(res)
// 	{
// 		console.log(res)
// 	},
// 	error: function(xhr)
// 	{
// 		console.error(xhr)
// 	}
// })

})