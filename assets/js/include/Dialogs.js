// window.$ = window.jQuery = require('jquery');

let DialogBox;
let PromptInputDialog;
let PromptConfirmDialog;
let AddAppointementPatientsDialog;
let OrderCartDialog;
let OrdersCartDialog;
let PreviewFileDialog;
let AddConsommablesToPatientDialog;
let SelectEmployeeDialog;
let FullpageDialog
let RingingBellDialog
let SelectDirDialog
let RequestDriverDialog
let MapDialog
let CreateImageSliderDialog
let ImageCropperDialog
let CreateChatGroupPostDialog
let CreateChatPrivateConversationDialog
let CreateChatGroupConversationDialog
$(function()
{

// 
// CreateChatGroupConversationDialog
CreateChatGroupConversationDialog = async (options = {}) =>
{
	var selector = 'chat_group_conversation_container_'+options.conversationUuid
	var dialog_container = $('#'+selector);
	var parentHTML = `<div class="no-pointer d-flex justify-content-center align-items-center position-fixed bottom-0 start-0 w-100 overflow-x-auto" id="chat_private_conversation_containers_parent" style="z-index:1000; max-width:100%;"></div>`
	var chat_private_conversation_containers_parent = $('#chat_private_conversation_containers_parent')
	var html = await getPage('../views/dialogs/chat-private-conversation-dialog.ejs')

	var ChatGroupConversationWorker = null

	var ChatObject = {
		receiver: options,
		media: [],
		body: '',
	}

	var isScrolledToBottom = true
	
	if ( !chat_private_conversation_containers_parent[0] )
	{
		$('body').prepend(parentHTML)
		chat_private_conversation_containers_parent = $('#chat_private_conversation_containers_parent')
	}
	
	if ( !dialog_container[0] )
	{
		var element = createFakeElement('chat_private_conversation_container_FAKE_CONTAINER', html)
		.find('.chat-private-conversation-dialog')
		element.attr('id', selector).css('margin-left', '10px')
		removeFakeElement('chat_private_conversation_container_FAKE_CONTAINER')
		chat_private_conversation_containers_parent.append(element[0].outerHTML)
		dialog_container = $('#'+selector);
		// dispatch event for new content on page
		dispatch_onNewAjaxContentLoaded()
	}
	
	show()
	
	const dialog_close_button = dialog_container.find('.dialog_close_button')
	const chat_private_conversation_avatar = dialog_container.find('.chat_private_conversation_avatar')
	const chat_private_conversation_user_name = dialog_container.find('.chat_private_conversation_user_name')

	const chat_private_conversation_dialog_body = dialog_container.find('.chat_private_conversation_dialog_body')
	const chat_private_conversation_dialog_body_contents = dialog_container.find('.chat_private_conversation_dialog_body_contents')
	const chat_private_conversation_dialog_body_empty_message  = dialog_container.find('.chat_private_conversation_dialog_body_empty_message')
	const chat_private_conversation_dialog_emojy_button = dialog_container.find('.chat_private_conversation_dialog_emojy_button')
	const chat_private_conversation_dialog_input = dialog_container.find('.chat_private_conversation_dialog_input')
	const chat_private_conversation_dialog_add_image_button = dialog_container.find('.chat_private_conversation_dialog_add_image_button')
	const chat_private_conversation_dialog_media_preview_gallery = dialog_container.find('.chat_private_conversation_dialog_media_preview_gallery')
	const chat_private_conversation_dialog_emoji_picker_container = dialog_container.find('.chat_private_conversation_dialog_emoji_picker_container')
	
	chat_private_conversation_avatar.attr('src', imgFallback(options.cover, '../assets/img/utils/placeholder.png') )
	chat_private_conversation_user_name.text(options.name)

	const pickmePicker = new PickmePicker({
		rootElement: chat_private_conversation_dialog_emoji_picker_container,
		trigger: chat_private_conversation_dialog_emojy_button
	})

	// send message
	chat_private_conversation_dialog_input.trigger('focus')
	chat_private_conversation_dialog_input.off('keyup').on('keyup', e =>
	{
		if ( e.key == 'Enter' && !e.shiftKey )
		{
			sendMessage()
		}
	})
	// on message
	if ( ChatGroupConversationWorker )
	{
		ChatGroupConversationWorker.onmessage = (e) =>
		{
			const messageData = e.data.data
			
			displayMessages(messageData, () =>
			{
				if ( isScrolledToBottom )
				{
					chat_private_conversation_dialog_body_contents.scrollTop( chat_private_conversation_dialog_body_contents[0].scrollHeight )
					// isScrolledToBottom = false
				}
			})
			// ChatGroupConversationWorker.terminate()
		}	
	}
	// emojy-selected
	pickmePicker.off('emojy-selected')
	.on('emojy-selected', e =>
	{
		var emojy = e.originalEvent.detail.emojy

		chat_private_conversation_dialog_input.append(emojy.img)
		setCursorAtEnd(chat_private_conversation_dialog_input)
	})
	// add media
	chat_private_conversation_dialog_add_image_button.off('click').on('click', e =>
	{
		chat_private_conversation_dialog_add_image_button.next().trigger('click')
	})
	// select media
	chat_private_conversation_dialog_add_image_button.next().off('change').on('change', async e =>
	{
		var target = chat_private_conversation_dialog_add_image_button.next()
		if ( target[0].files.length == 0 ) return

		const files = target[0].files

		for (let i = 0; i < files.length; i++) 
		{
			const file = files[i]
			const dataURL = await imageToDataURL(file)
			
			ChatObject.media.push({
				url: dataURL
			})
		}
		previewMediaGallery()
	})
	// close
	dialog_close_button.off('click').on('click', e =>
	{
		clear()
	})
	// chat_private_conversation_dialog_body_contents
	chat_private_conversation_dialog_body_contents.off('scroll').on('scroll', e =>
	{
		isScrolledToBottom = isMessageAreaScrollHeightReached()
	})

	function show()
	{
		dialog_container.removeClass('d-none');
		launchWorker()

		ChatGroupConversationWorker.postMessage({
			USER_CONFIG: USER_CONFIG,
			DEFAULT_INI_SETTINGS: DEFAULT_INI_SETTINGS,
			operation: '',
			chat: ChatObject,
		})
	}

	function hide()
	{
		dialog_container.addClass('d-none');
	}

	function clear()
	{
		terminateWorker()
		dialog_container.remove();
	}

	// launch worker
	function launchWorker()
	{
		ChatGroupConversationWorker = new Worker('../assets/js/workers/ChatGroupConversationWorker.js')
	}
	// terminate worker
	function terminateWorker()
	{
		if ( !ChatGroupConversationWorker ) return

		ChatGroupConversationWorker.terminate()
		ChatGroupConversationWorker = null
	}
	// reset form
	function resetFields()
	{
		chat_private_conversation_dialog_input.html('').trigger('focus')
		ChatObject.media = []
		ChatObject.body = ''
		clearMediaGallery()
	}
	// append message
	function sendMessage()
	{	
		ChatObject.body = chat_private_conversation_dialog_input.html()

		ChatGroupConversationWorker.postMessage({
			USER_CONFIG: USER_CONFIG,
			DEFAULT_INI_SETTINGS: DEFAULT_INI_SETTINGS,
			operation: 'send',
			chat: ChatObject,
		})

		chat_private_conversation_dialog_body_contents.scrollTop( chat_private_conversation_dialog_body_contents[0].scrollHeight )
		resetFields()
	}
	// display messages
	function displayMessages(data, callback)
	{
		if ( chat_private_conversation_dialog_body_empty_message[0] )
		{
			chat_private_conversation_dialog_body_empty_message.remove()
			chat_private_conversation_dialog_body.removeClass('align-items-center')
			.css('flex-direction', 'column-inverse')
			chat_private_conversation_dialog_body_contents.removeClass('d-none')
			.addClass('d-flex')
		}
		var dataHTML = ''

		$.each(data, (k,v) =>
		{
			var message_media_html = ''

			if ( v.sender_id == USER_CONFIG.employee_id && v.sender_type == 'employees' )
			{
				if ( v.media )
				{
					message_media_html = '<div class="gallery-grid mt-2">'
					for (let i = 0; i < v.media.length; i++) 
					{
						const media = v.media[i]
						
						message_media_html += ` <figure class="gallery-grid-item m-0" style="flex: 35%;">
													<img src="${media.url}" class="gallery-grid-img js_img_previewable">
												</figure>`
					}
					message_media_html+= '</div>'
				}

				dataHTML += `<div class="chat-private-conversation-message message-sent">
								<div class="row">
									<div class="col">
										<div class="chat-private-conversation-message-content">
											${v.body}
										</div>
									</div>
								</div>
								${message_media_html}
							</div>`
				// dataHTML += message_media_html
			}
			else
			{
				if ( v.media )
				{
					message_media_html = '<div class="gallery-grid mt-2">'
					for (let i = 0; i < v.media.length; i++) 
					{
						const media = v.media[i]
						
						message_media_html += ` <figure class="gallery-grid-item m-0" style="flex: 35%;">
													<img src="${media.url}" class="gallery-grid-img js_img_previewable">
												</figure>`
					}
					message_media_html+= '</div>'
				}

				dataHTML += `<div class="chat-private-conversation-message message-received">
								<div class="row">
									<div class="col-2" style="max-width: 11%;">
										<img src="${ imgFallback(v.patientAvatar) }" class="width-28px height-28px rounded-circle" alt="">
									</div>
									<div class="col">
										<div class="chat-private-conversation-message-content">
											${ imgFallback(v.receiver_name) }
										</div>
									</div>
								</div>
								${message_media_html}
							</div>`
				// dataHTML += message_media_html
			}
		})

		chat_private_conversation_dialog_body_contents.html(dataHTML)
		// dispatch_onNewAjaxContentLoaded
        dispatch_onNewAjaxContentLoaded()

		if ( typeof callback == 'function' )
		{
			callback(data)
		}
	}
	// clear media gallery
	function clearMediaGallery()
	{
		chat_private_conversation_dialog_media_preview_gallery.html('').addClass('d-none')
		chat_private_conversation_dialog_add_image_button.next().val(null)
		ChatObject.media = []
	}
	// preview media gallery
	function previewMediaGallery()
	{
		var html = ''

		chat_private_conversation_dialog_media_preview_gallery.html(`
			<div class="has-text-left">
				<button class="close-button-sm chat_private_conversation_dialog_media_preview_gallery_close_button">
					<i class="xfb xfb-close-sm-thin"></i>    
				</button>
			</div>
		`)
		.removeClass('d-none')

		for (let i = 0; i < ChatObject.media.length; i++) 
		{
			const media = ChatObject.media[i]
			
			html += `<figure class="gallery-grid-item m-0" style="flex: 25%;">
						<img src="${media.url}" class="gallery-grid-img js_img_previewable">
					</figure>`
		}

		chat_private_conversation_dialog_media_preview_gallery.append(html)

		const chat_private_conversation_dialog_media_preview_gallery_close_button = chat_private_conversation_dialog_media_preview_gallery.find('.chat_private_conversation_dialog_media_preview_gallery_close_button')

		chat_private_conversation_dialog_media_preview_gallery_close_button.off('click').on('click', e =>
		{
			clearMediaGallery()
		})
	}
	// check content area scroll height reached
	function isMessageAreaScrollHeightReached()
	{
		return chat_private_conversation_dialog_body_contents[0].scrollTop + chat_private_conversation_dialog_body_contents[0].clientHeight >= chat_private_conversation_dialog_body_contents[0].scrollHeight
	}
}
// CreateChatPrivateConversationDialog
CreateChatPrivateConversationDialog = async (options = {}) =>
{
	var selector = 'chat_private_conversation_container_'+options.conversationUuid
	var dialog_container = $('#'+selector);
	var parentHTML = `<div class="no-pointer d-flex justify-content-center align-items-center position-fixed bottom-0 start-0 w-100 overflow-x-auto" id="chat_private_conversation_containers_parent" style="z-index:1000; max-width:100%;"></div>`
	var chat_private_conversation_containers_parent = $('#chat_private_conversation_containers_parent')
	var html = await getPage('../views/dialogs/chat-private-conversation-dialog.ejs')

	var ChatPrivateConversationWorker = null

	var ChatObject = {
		receiver: options,
		media: [],
		body: '',
	}

	var isScrolledToBottom = true
	
	if ( !chat_private_conversation_containers_parent[0] )
	{
		$('body').prepend(parentHTML)
		chat_private_conversation_containers_parent = $('#chat_private_conversation_containers_parent')
	}
	
	if ( !dialog_container[0] )
	{
		var element = createFakeElement('chat_private_conversation_container_FAKE_CONTAINER', html)
		.find('.chat-private-conversation-dialog')
		element.attr('id', selector).css('margin-left', '10px')
		removeFakeElement('chat_private_conversation_container_FAKE_CONTAINER')
		chat_private_conversation_containers_parent.append(element[0].outerHTML)
		dialog_container = $('#'+selector);
		// dispatch event for new content on page
		dispatch_onNewAjaxContentLoaded()
	}
	
	show()
	
	const dialog_close_button = dialog_container.find('.dialog_close_button')
	const chat_private_conversation_avatar = dialog_container.find('.chat_private_conversation_avatar')
	const chat_private_conversation_user_name = dialog_container.find('.chat_private_conversation_user_name')

	const chat_private_conversation_dialog_body = dialog_container.find('.chat_private_conversation_dialog_body')
	const chat_private_conversation_dialog_body_contents = dialog_container.find('.chat_private_conversation_dialog_body_contents')
	const chat_private_conversation_dialog_body_empty_message  = dialog_container.find('.chat_private_conversation_dialog_body_empty_message')
	const chat_private_conversation_dialog_emojy_button = dialog_container.find('.chat_private_conversation_dialog_emojy_button')
	const chat_private_conversation_dialog_input = dialog_container.find('.chat_private_conversation_dialog_input')
	const chat_private_conversation_dialog_add_image_button = dialog_container.find('.chat_private_conversation_dialog_add_image_button')
	const chat_private_conversation_dialog_media_preview_gallery = dialog_container.find('.chat_private_conversation_dialog_media_preview_gallery')
	const chat_private_conversation_dialog_emoji_picker_container = dialog_container.find('.chat_private_conversation_dialog_emoji_picker_container')
	
	chat_private_conversation_avatar.attr('src', imgFallback(options.patientAvatar, '../assets/img/utils/user.png') )
	chat_private_conversation_user_name.text(options.patientName)

	const pickmePicker = new PickmePicker({
		rootElement: chat_private_conversation_dialog_emoji_picker_container,
		trigger: chat_private_conversation_dialog_emojy_button
	})

	// send message
	chat_private_conversation_dialog_input.trigger('focus')
	chat_private_conversation_dialog_input.off('keyup').on('keyup', e =>
	{
		if ( e.key == 'Enter' && !e.shiftKey )
		{
			sendMessage()
		}
	})
	// on message
	if ( ChatPrivateConversationWorker )
	{
		ChatPrivateConversationWorker.onmessage = (e) =>
		{
			const messageData = e.data.data
			
			displayMessages(messageData, () =>
			{
				if ( isScrolledToBottom )
				{
					chat_private_conversation_dialog_body_contents.scrollTop( chat_private_conversation_dialog_body_contents[0].scrollHeight )
					// isScrolledToBottom = false
				}
			})
			// ChatPrivateConversationWorker.terminate()
		}	
	}
	// emojy-selected
	pickmePicker.off('emojy-selected')
	.on('emojy-selected', e =>
	{
		var emojy = e.originalEvent.detail.emojy

		chat_private_conversation_dialog_input.append(emojy.img)
		setCursorAtEnd(chat_private_conversation_dialog_input)
	})
	// add media
	chat_private_conversation_dialog_add_image_button.off('click').on('click', e =>
	{
		chat_private_conversation_dialog_add_image_button.next().trigger('click')
	})
	// select media
	chat_private_conversation_dialog_add_image_button.next().off('change').on('change', async e =>
	{
		var target = chat_private_conversation_dialog_add_image_button.next()
		if ( target[0].files.length == 0 ) return

		const files = target[0].files

		for (let i = 0; i < files.length; i++) 
		{
			const file = files[i]
			const dataURL = await imageToDataURL(file)
			
			ChatObject.media.push({
				url: dataURL
			})
		}

		previewMediaGallery()
	})
	// close
	dialog_close_button.off('click').on('click', e =>
	{
		clear()
	})
	// chat_private_conversation_dialog_body_contents
	chat_private_conversation_dialog_body_contents.off('scroll').on('scroll', e =>
	{
		isScrolledToBottom = isMessageAreaScrollHeightReached()
	})

	function show()
	{
		dialog_container.removeClass('d-none');
		launchWorker()

		ChatPrivateConversationWorker.postMessage({
			USER_CONFIG: USER_CONFIG,
			DEFAULT_INI_SETTINGS: DEFAULT_INI_SETTINGS,
			operation: '',
			chat: ChatObject,
		})
	}

	function hide()
	{
		dialog_container.addClass('d-none');
	}

	function clear()
	{
		terminateWorker()
		dialog_container.remove();
	}

	// launch worker
	function launchWorker()
	{
		ChatPrivateConversationWorker = new Worker('../assets/js/workers/ChatPrivateConversationWorker.js')
	}
	// terminate worker
	function terminateWorker()
	{
		if ( !ChatPrivateConversationWorker ) return

		ChatPrivateConversationWorker.terminate()
		ChatPrivateConversationWorker = null
	}
	// reset form
	function resetFields()
	{
		chat_private_conversation_dialog_input.html('').trigger('focus')
		ChatObject.media = []
		ChatObject.body = ''
		clearMediaGallery()
	}
	// append message
	function sendMessage()
	{	
		ChatObject.body = chat_private_conversation_dialog_input.html()

		ChatPrivateConversationWorker.postMessage({
			USER_CONFIG: USER_CONFIG,
			DEFAULT_INI_SETTINGS: DEFAULT_INI_SETTINGS,
			operation: 'send',
			chat: ChatObject,
		})

		chat_private_conversation_dialog_body_contents.scrollTop( chat_private_conversation_dialog_body_contents[0].scrollHeight )
		resetFields()
	}
	// display messages
	function displayMessages(data, callback)
	{
		if ( chat_private_conversation_dialog_body_empty_message[0] )
		{
			chat_private_conversation_dialog_body_empty_message.remove()
			chat_private_conversation_dialog_body.removeClass('align-items-center')
			.css('flex-direction', 'column-inverse')
			chat_private_conversation_dialog_body_contents.removeClass('d-none')
			.addClass('d-flex')
		}
		var dataHTML = ''

		$.each(data, (k,v) =>
		{
			var message_media_html = ''

			if ( v.sender_id == USER_CONFIG.employee_id && v.sender_type == 'employees' )
			{
				if ( v.media )
				{
					message_media_html = '<div class="gallery-grid mt-2">'
					for (let i = 0; i < v.media.length; i++) 
					{
						const media = v.media[i]
						
						message_media_html += ` <figure class="gallery-grid-item m-0" style="flex: 35%;">
													<img src="${media.url}" class="gallery-grid-img js_img_previewable">
												</figure>`
					}
					message_media_html+= '</div>'
				}

				dataHTML += `<div class="chat-private-conversation-message message-sent">
								<div class="row">
									<div class="col">
										<div class="chat-private-conversation-message-content">
											${v.body}
										</div>
									</div>
								</div>
								${message_media_html}
							</div>`
				// dataHTML += message_media_html
			}
			else
			{
				if ( v.media )
				{
					message_media_html = '<div class="gallery-grid mt-2">'
					for (let i = 0; i < v.media.length; i++) 
					{
						const media = v.media[i]
						
						message_media_html += ` <figure class="gallery-grid-item m-0" style="flex: 35%;">
													<img src="${media.url}" class="gallery-grid-img js_img_previewable">
												</figure>`
					}
					message_media_html+= '</div>'
				}

				dataHTML += `<div class="chat-private-conversation-message message-received">
								<div class="row">
									<div class="col-2" style="max-width: 11%;">
										<img src="${ imgFallback(v.patientAvatar) }" class="width-28px height-28px rounded-circle" alt="">
									</div>
									<div class="col">
										<div class="chat-private-conversation-message-content">
											${ imgFallback(v.receiver_name) }
										</div>
									</div>
								</div>
								${message_media_html}
							</div>`
				// dataHTML += message_media_html
			}
		})

		chat_private_conversation_dialog_body_contents.html(dataHTML)
		// dispatch_onNewAjaxContentLoaded
        dispatch_onNewAjaxContentLoaded()

		if ( typeof callback == 'function' )
		{
			callback(data)
		}
	}
	// clear media gallery
	function clearMediaGallery()
	{
		chat_private_conversation_dialog_media_preview_gallery.html('').addClass('d-none')
		chat_private_conversation_dialog_add_image_button.next().val(null)
		ChatObject.media = []
	}
	// preview media gallery
	function previewMediaGallery()
	{
		var html = ''

		chat_private_conversation_dialog_media_preview_gallery.html(`
			<div class="has-text-left">
				<button class="close-button-sm chat_private_conversation_dialog_media_preview_gallery_close_button">
					<i class="xfb xfb-close-sm-thin"></i>    
				</button>
			</div>
		`)
		.removeClass('d-none')

		for (let i = 0; i < ChatObject.media.length; i++) 
		{
			const media = ChatObject.media[i]
			
			html += `<figure class="gallery-grid-item m-0" style="flex: 25%;">
						<img src="${media.url}" class="gallery-grid-img js_img_previewable">
					</figure>`
		}

		chat_private_conversation_dialog_media_preview_gallery.append(html)

		const chat_private_conversation_dialog_media_preview_gallery_close_button = chat_private_conversation_dialog_media_preview_gallery.find('.chat_private_conversation_dialog_media_preview_gallery_close_button')

		chat_private_conversation_dialog_media_preview_gallery_close_button.off('click').on('click', e =>
		{
			clearMediaGallery()
		})
	}
	// check content area scroll height reached
	function isMessageAreaScrollHeightReached()
	{
		return chat_private_conversation_dialog_body_contents[0].scrollTop + chat_private_conversation_dialog_body_contents[0].clientHeight >= chat_private_conversation_dialog_body_contents[0].scrollHeight
	}
}
// CreateGroupPostDialog
CreateChatGroupPostDialog = async (options = {}, callback = null) =>
{
	var selector = 'create_chat_group_post_dialog_container'
	var dialog_container = $('#'+selector);
	var html = await getPage('../views/dialogs/create-chat-group-post-dialog.ejs')

	if ( !dialog_container[0] )
	{
		$(html).insertBefore(MAIN_CONTENT_CONTAINER)
		dialog_container = $('#'+selector);
		// dispatch event for new content on page
		dispatch_onNewAjaxContentLoaded()
	}
	show()

	var dialog_close_button = dialog_container.find('.dialog_close_button')
	
	var user_name = dialog_container.find('#user_name')
	var user_phone = dialog_container.find('#user_phone')
	var group_status = dialog_container.find('#group_status')

	var chat_group_post_area_title_input = dialog_container.find('#chat_group_post_area_title_input')
	var chat_group_post_area_input = dialog_container.find('#chat_group_post_area_input')
	var chat_group_post_submit_button = dialog_container.find('#chat_group_post_submit_button')

	var chat_group_post_content_area = dialog_container.find('#chat_group_post_content_area')
	var fb_post_image_backgrounds_trigger_open = dialog_container.find('#fb_post_image_backgrounds_trigger_open')
	var fb_post_image_backgrounds_trigger_close = dialog_container.find('#fb_post_image_backgrounds_trigger_close')
	var fb_post_image_backgrounds_wrapper = dialog_container.find('#fb_post_image_backgrounds_wrapper')
	var fb_post_image_backgrounds_list = dialog_container.find('#fb_post_image_backgrounds_list')

	var emoji_picker_container_trigger_button = dialog_container.find('#emoji_picker_container_trigger_button')
	var emoji_picker_container = dialog_container.find('#emoji_picker_container')

	const pickmePicker = new PickmePicker({
		rootElement: emoji_picker_container,
		trigger: emoji_picker_container_trigger_button
	})

	const chat_group_post_select_media_component_ = dialog_container.find('#chat_group_post_select_media_component_')

	const chat_group_post_add_to_your_post_ = dialog_container.find('#chat_group_post_add_to_your_post_')
	const js_add_to_your_post_control_action__add_media = chat_group_post_add_to_your_post_.find('.js_add_to_your_post_control_action__add_media')

	// display info
	user_name.text(USER_CONFIG.employee_name)
	user_phone.text(USER_CONFIG.employee_phone)
	
	group_status.find('#group_status_icon').html( (options.type == 'public') ? `<i class="xfb xfb-globe pointer" title="${ FUI_DISPLAY_LANG.views.pages.global.chat_group_types[options.type] }"></i>` : `<i class="xfb xfb-lock pointer" title="${ FUI_DISPLAY_LANG.views.pages.global.chat_group_types[options.type] }"></i>` )
	group_status.find('#group_status_text').text( FUI_DISPLAY_LANG.views.pages.global.chat_group_types[options.type] )

	var groupPostMedia = []
	// close
	dialog_close_button.off('click').on('click', e =>
	{
		clear()
	})

	// chat_group_post_area_input
	chat_group_post_area_input.off('keyup').on('keyup', e =>
	{
		if ( checkContentEditableEmpty(chat_group_post_area_input) ) chat_group_post_submit_button.addClass('disabled')
		else chat_group_post_submit_button.removeClass('disabled')
	})

	// submit
	chat_group_post_submit_button.off('click').on('click', async e => 
	{
		SectionLoader(dialog_container.find('.dialog-1-body'))
		var res = await CHAT_MODEL.group_post_store({
			name: chat_group_post_area_title_input.val(),
			body: chat_group_post_area_input.html(),
			css: options.css,
			group_id: options.id,
			group_name: options.name,
			employee_id: USER_CONFIG.employee_id,
			employee_name: USER_CONFIG.employee_name,
			employee_phone: USER_CONFIG.employee_phone,
			employee_type_id: USER_CONFIG.employee_type_id,
			employee_type_code: USER_CONFIG.employee_type_code,
			media: groupPostMedia,
		})
		SectionLoader(dialog_container.find('.dialog-1-body'), '')

		CreateToast('PS', res.message, '')

		if ( res.code == 404 ) return

		chat_group_post_area_title_input.val(null)
		chat_group_post_area_input.html('').trigger('blur')

		if ( typeof callback == 'function' )
		{
			callback(res)
		}

		clear()
	})

	// trigger open backgrounds
	fb_post_image_backgrounds_trigger_open.off('click').on('click', e =>
	{
		fb_post_image_backgrounds_wrapper.removeClass('d-none')
		fb_post_image_backgrounds_trigger_open.addClass('d-none')
	})
	// trigger close backgrounds
	fb_post_image_backgrounds_trigger_close.off('click').on('click', e =>
	{
		fb_post_image_backgrounds_wrapper.addClass('d-none')
		fb_post_image_backgrounds_trigger_open.removeClass('d-none')
	})
	// select background
	fb_post_image_backgrounds_list.off('click').on('click', e =>
	{
		var target = $(e.target)

		if ( target.data('role') == 'background' )
		{
			const BG_CLASSES = $.map( fb_post_image_backgrounds_list.children('li'), (element, k) =>
			{
				const li = $(element)
				const background = li.find('[data-role="background"]')
				if ( background[0] )
					return background.data('class')
			})

			// chat_group_post_content_area.css('background', target.css('background'))
			// .data('background-class', target.attr('class')).attr('data-background-class', target.attr('class'))
			chat_group_post_content_area.removeClass(BG_CLASSES).addClass(target.data('class'))
			target.parent().addClass('active').siblings().removeClass('active')
			chat_group_post_area_input.removeClass('fs-16').addClass('fs-30 has-text-centered')

			chat_group_post_area_input.css('color', '#ffffff')

			if ( chat_group_post_content_area.hasClass('fb-post-bg-1') )
			{
				chat_group_post_area_input.css('color', '#000000')
				chat_group_post_area_input.removeClass('fs-30 has-text-centered').addClass('fs-16')
			}

			options.css = {
				classes: [target.data('class')],
			}
		}
	})

	// emojy-selected
	pickmePicker.off('emojy-selected')
	.on('emojy-selected', e =>
	{
		var emojy = e.originalEvent.detail.emojy

		chat_group_post_area_input.append(emojy.img)
		setCursorAtEnd(chat_group_post_area_input)
	})

	// add-to-your-post:action
	$(document).off('add-to-your-post:action').on('add-to-your-post:action',async  e =>
	{
		var detail = e.originalEvent.detail
		
		if ( detail.id != chat_group_post_add_to_your_post_.attr('id') ) return

		if ( detail.action == 'add-media' )
		{
			chat_group_post_select_media_component_.removeClass('d-none')
		}
	})
	// media selected
	$(document).off('group-post-media-selected').on('group-post-media-selected',async  e =>
	{
		var detail = e.originalEvent.detail
		
		if ( detail.id != chat_group_post_select_media_component_.attr('id') ) return

		console.log(detail)
		groupPostMedia = detail.urls
	})
	// media cleared
	$(document).off('group-post-media-cleared').on('group-post-media-cleared',async  e =>
	{
		var detail = e.originalEvent.detail
		
		if ( detail.id != chat_group_post_select_media_component_.attr('id') ) return

		groupPostMedia = []
	})

	function show()
	{
		dialog_container.removeClass('d-none');
	}

	function hide()
	{
		dialog_container.addClass('d-none');
	}

	function clear()
	{
		dialog_container.remove();
	}
}
// ImageCropperDialog
ImageCropperDialog = async (options = {}, callback = null) =>
{
	const defaultOptions = {

		// full-size crop area
		full : false,
	
		// min / max size of crop area
		minSize : [20, 20],
		maxSize : [null, null],
	
		// preserve the original radio
		preserveAspectRatio : false,
	
		// generate an input with crop data
		inputs : true,
	
		// prefix to input
		inputsPrefix : '',
	
		// <a href="https://www.jqueryscript.net/tags.php?/grid/">grid</a> style crop area
		grid : true
		
	}

	options = {...defaultOptions, ...options}

	var selector = 'image_cropper_dialog'
	var dialog_container = $('#'+selector);
	var html = await getPage('../views/dialogs/image-cropper-dialog.ejs')

	if ( !dialog_container[0] )
	{
		$(html).insertBefore(MAIN_CONTENT_CONTAINER)
		dialog_container = $('#'+selector);
	}
	show()

	var closeBTN = dialog_container.find('#closeBTN')
	var submitBTN = dialog_container.find('#submitBTN')
	var imageHTML = `<img src="../assets/img/utils/placeholder.jpg" id="image_element" class="img-fluid" alt="">`
	dialog_container.find('.block-body').html(imageHTML)
	var image_element = dialog_container.find('#image_element')
	// var canvas = document.createElement('canvas')
	// var ctx = canvas.getContext('2d')
	var dataURL = ''
	let rcrop
	// const Cropper = require('cropperjs')
	image_element.attr('src', options.url)
	// var cropper = image_element.Jcrop(options)
	image_element.off('load').on('load', e =>
	{
		image_element.rcrop(options)
		rcrop = image_element.data('rcrop')
	})
	image_element.off('rcrop-changed').on('rcrop-changed', function(e){
		// When crop area has been changed.
		dataURL = rcrop.getDataURL()

	})
	
	image_element.off('rcrop-ready').on('rcrop-ready', function(e){
		// When image has been read and rCrop is ready.
		dataURL = rcrop.getDataURL()
	})
	
	image_element.off('rcrop-change').on('rcrop-change', function(e){
		// When crop area is being changed.
		// dataURL = rcrop.getDataURL()
	})
	

	// close
	closeBTN.off('click').on('click', e =>
	{
		dialog_container.find('.block-body').html('')
		hide()
		if ( typeof callback == 'function' )
		{
			callback({
				rcrop: rcrop,
				url: options.url
			})
		}
	})
	// ok
	submitBTN.off('click').on('click', async e =>
	{
		dialog_container.find('.block-body').html('')
		hide()
		if ( typeof callback == 'function' )
		{
			var blob = await urlToBlob(dataURL)
			var file = blobToFile(blob, (options.file) ? options.file.name : '')
			callback({
				rcrop: rcrop,
				url: dataURL,
				file: file,
			})
		}
	})

	function show()
	{
		dialog_container.addClass('active');
	}

	function hide()
	{
		dialog_container.removeClass('active');
	}
}
// CreateImageSliderDialog
CreateImageSliderDialog = async (options = {}) =>
{
	var selector = 'create_image_slider_dialog'
	var dialog_container = $('#'+selector);
	var html = await getPage('../views/dialogs/create-image-slider-dialog.ejs')

	if ( !dialog_container[0] )
	{
		$(html).insertBefore(MAIN_CONTENT_CONTAINER)
		dialog_container = $('#'+selector);
	}
	show()

	var closeBTN = dialog_container.find('#closeBTN')
	var current_image_element = dialog_container.find('#current_image_element')
	var image_slider_nav_next = dialog_container.find('#image_slider_nav_next')
	var image_slider_nav_previous = dialog_container.find('#image_slider_nav_previous')

	var currentSlide = 0
	// show first image
	current_image_element.attr('src', options.images[currentSlide])

	// close
	closeBTN.off('click').on('click', e =>
	{
		hide()
	})
	// next
	image_slider_nav_next.off('click').on('click', e =>
	{
		nextSlide()
	})
	// previous
	image_slider_nav_previous.off('click').on('click', e =>
	{
		previousSlide()
	})

	function show()
	{
		dialog_container.removeClass('d-none');
	}

	function hide()
	{
		dialog_container.addClass('d-none');
	}
	// next
	function nextSlide()
	{
		currentSlide++
		if ( currentSlide > options.images.length - 1 ) currentSlide = 0
		
		current_image_element.attr('src', options.images[currentSlide])
	}
	// previous
	function previousSlide()
	{
		currentSlide--
		if ( currentSlide < 0 ) currentSlide = options.images.length - 1

		current_image_element.attr('src', options.images[currentSlide])
	}
}
// MapDialog
MapDialog = async (options = {}) =>
{
	var selector = 'map_dialog'
	var dialog_container = $('#'+selector);
	var html = await getPage('../views/dialogs/map-dialog.ejs')

	if ( !dialog_container[0] )
	{
		$(html).insertBefore(MAIN_CONTENT_CONTAINER)
		dialog_container = $('#'+selector);
	}
	show()

	var closeBTN = dialog_container.find('#closeBTN')
	var mapElement = dialog_container.find('#mapElement')

	showInMap(mapElement[0], options)
	// close
	closeBTN.off('click').on('click', e =>
	{
		hide()
	})

	function show()
	{
		dialog_container.removeClass('d-none');
	}

	function hide()
	{
		dialog_container.addClass('d-none');
	}
}
// RequestDriverDialog
RequestDriverDialog = async () =>
{
	var selector = 'driver_job_dialog'
	var dialog_container = $('#'+selector);
	var html = await getPage('../views/dialogs/request-driver-dialog.ejs')

	if ( !dialog_container[0] )
	{
		$(html).insertBefore(MAIN_CONTENT_CONTAINER)
		dialog_container = $('#'+selector);
	}
	// make draggable
	// dialog_container.draggable()
	show()

	var closeBTN = dialog_container.find('#closeBTN');

	var ERROR_BOX = dialog_container.find('#ERROR_BOX');

	var settings_form = dialog_container.find('#settings_form');
	var submit_button = settings_form.find(':submit')
	var from_place_input = settings_form.find('#from_place_input');
	var from_place_coords_input = settings_form.find('#from_place_coords_input');
	var from_place_phone_input = settings_form.find('#from_place_phone_input');
	var to_place_input = settings_form.find('#to_place_input');
	var to_place_coords_input = settings_form.find('#to_place_coords_input');
	var to_place_phone_input = settings_form.find('#to_place_phone_input');
	var description_input = settings_form.find('#description_input');
	var selected_date_input = settings_form.find('#selected_date_input');
	var selected_time_input = settings_form.find('#selected_time_input');

	// close
	closeBTN.off('click').on('click', e =>
	{
		hide()
	});

	// submit
	settings_form.off('submit').on('submit', async e =>
	{
		e.preventDefault()
		submit_button.addClass('disabled')
		var res = await DRIVER_JOB_MODEL.store({
			from_place: from_place_input.val(),
			from_place_coords: from_place_coords_input.val(),
			from_place_phone: from_place_phone_input.val(),
			to_place: to_place_input.val(),
			to_place_coords: to_place_coords_input.val(),
			to_place_phone: to_place_phone_input.val(),
			employee_id: USER_CONFIG.employee_id,
			employee_name: USER_CONFIG.employee_name,
			employee_type_id: USER_CONFIG.type.employee_type_id,
			employee_type_code: USER_CONFIG.type.employee_type_code,
			description: description_input.val(),
			selected_date: selected_date_input.val(),
			selected_time: selected_time_input.val(),
		})
		submit_button.removeClass('disabled')

		// ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(res.message)
		CreateToast('PS', res.message, '')
		if ( res.code == 404 ) return

		settings_form[0].reset()
	})

	// from-place-location-selected
	$(document).off('from-place-location-selected').on('from-place-location-selected', e =>
	{
		var detail = e.originalEvent.detail
		var location = detail.location

		if ( detail.eventsReceiverId != selector ) return
		
		from_place_coords_input.val( convertCoordinates(location.coordinates, 'string') )
	})
	// to-place-location-selected
	$(document).off('to-place-location-selected').on('to-place-location-selected', e =>
	{
		var detail = e.originalEvent.detail
		var location = detail.location

		if ( detail.eventsReceiverId != selector ) return
		
		to_place_coords_input.val( convertCoordinates(location.coordinates, 'string') )
	})

	function show()
	{
		dialog_container.removeClass('d-none');
	}
	function hide()
	{
		dialog_container.addClass('d-none');
	}

}
// Select directory dialog
SelectDirDialog = () =>
{
	return new Promise((resolve, reject) =>
	{
		ipcIndexRenderer.send('show-select-dir-dialog');
		ipcIndexRenderer.removeAllListeners('dialog-dir-selected');
		ipcIndexRenderer.on('dialog-dir-selected', (e, arg) =>
		{
			if ( arg.canceled )
			{
				reject(arg);
				return;
			}
			resolve(arg);
		});
	});
}
//RingingBellDialog
RingingBellDialog = async (options = {}) =>
{
	var selector = 'ringing_bell_dialog'
	var dialog_container = $('#'+selector);
	var html = ''

	const BELL_BUTTON_PUSHED_ICON = '../assets/img/utils/bell-ringing.png'
	const BELL_BUTTON_DEFAULT_ICON = '../assets/img/utils/bell.png'
	const CENTER_TYPE_CENTER = 'center'
	const CENTER_TYPE_CENTRAL_ADMIN = 'central_admin'

	if ( options.center_type == CENTER_TYPE_CENTER )
		html = await getPage('../views/dialogs/centers/ringing-bell-dialog.ejs')
	else if ( options.center_type == CENTER_TYPE_CENTRAL_ADMIN )
		html = await getPage('../views/dialogs/central_admin/ringing-bell-dialog.ejs')

	if ( !dialog_container[0] )
	{
		$(html).insertBefore(MAIN_CONTENT_CONTAINER)
		dialog_container = $('#'+selector);
	}

	var closeBTN = dialog_container.find('#closeBTN');

	var settings_form = dialog_container.find('#settings_form');
	var center_type_select = dialog_container.find('#center_type_select')
	var clinic_select = dialog_container.find('#clinic_select')
	var employee_type_select = dialog_container.find('#employee_type_select')
	var delay_timeout_input = settings_form.find('#delay_timeout_input');
	var message_input = settings_form.find('#message_input');

	var push_bell_button = dialog_container.find('#push_bell_button')

	var BellObject = {
		triggered_by_id: USER_CONFIG.employee_id,
		triggered_by_name: USER_CONFIG.employee_name,
		administration_id : clinic_select.find(':selected').val(),
		employee_type_id: 0,
		settings: null
	}

	// show
	if ( options.visible )
		show()

	// make draggable
	dialog_container.draggable()
	// select center type
	center_type_select.off('change').on('change', e =>
	{
		var target = $(e.target)
		var selected = center_type_select.find(':selected')

		if ( selected.val() == CENTER_TYPE_CENTER )
		{
			target.parent().next().removeClass('d-none')
			BellObject.administration_id = clinic_select.find(':selected').val()
			displayEmployeeTypes('')
		}
		else if ( selected.val() == CENTER_TYPE_CENTRAL_ADMIN )
		{
			target.parent().next().addClass('d-none')
			BellObject.administration_id = 0
			displayEmployeeTypes('.')
		}
	})
	center_type_select.trigger('change')
	// select clinic
	clinic_select.off('change').on('change', e =>
	{
		var target = $(e.target)
		BellObject.administration_id = clinic_select.find(':selected').val()
	})
	// close
	closeBTN.off('click');
	closeBTN.on('click', e =>
	{
		hide();
	});
	// save settings
	settings_form.off('submit').on('submit', e =>
	{
		e.preventDefault()

		setSettings()

		if ( FUI_DISPLAY_LANG.lang == 'ar' )
				CreateToast('اشعار', "تم حفظ اعدادت الجرس", 'الآن');
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			CreateToast('Notification', "Les paramètres de la cloche ont été enregistrés", 'maintenant');
	})
	// delay timeout
	delay_timeout_input.off('input').on('input', e =>
	{
		var target = $(e.target)
		var val = target.val()+'s'
		target.data('tooltip-top', val).attr('data-tooltip-top', val)
	})
	// ring the bell
	push_bell_button.off('click').on('click', async e =>
	{
		if ( !DEFAULT_INI_SETTINGS.Bell_Settings )
		{
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
				CreateToast('اشعار', "الرجاء التعديل في اعدادات الجرس اولا", 'الآن');
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
				CreateToast('Notification', "Veuillez d'abord modifier les paramètres de la cloche", 'maintenant');
			return
		}
		push_bell_button.addClass('no-pointer').find('img').attr('src', BELL_BUTTON_PUSHED_ICON)
		setTimeout(() => {
			push_bell_button.removeClass('no-pointer')
			.find('img').attr('src', BELL_BUTTON_DEFAULT_ICON)
		}, 3*1000);

		BellObject.settings = JSON.stringify(DEFAULT_INI_SETTINGS.Bell_Settings)
		BellObject.employee_type_id = employee_type_select.find(':selected').val()

		console.log(clinic_select.find(':selected').val())
		var res = await RINGING_BELL_MODEL.store(BellObject)
		if ( res.code == 404 )
		{
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
				CreateToast('اشعار', res.message, 'الآن');
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
				CreateToast('Notification', res.message, 'maintenant');
		}
	})
	//
	function show()
	{
		dialog_container.removeClass('d-none');
	}
	function hide()
	{
		dialog_container.addClass('d-none');
	}
	// set bell settings
	function setSettings()
	{
		var fini = new IniFile(APP_TMP_DIR+'/');

		var settings = {
			DELAY_TIMEOUT: delay_timeout_input.val(),
			TEXT_MESSAGE: message_input.val()
		};

		fini.writeSync(SETTINGS_FILE, settings, 'Bell_Settings');
		// reload ini settings
		loadIniSettingsSync();
	}
	// load settings
	loadSettings()
	function loadSettings()
	{
		if ( !DEFAULT_INI_SETTINGS.Bell_Settings ) return
		delay_timeout_input.val(DEFAULT_INI_SETTINGS.Bell_Settings.DELAY_TIMEOUT)
		.data('tooltip-top', DEFAULT_INI_SETTINGS.Bell_Settings.DELAY_TIMEOUT+'s')
		.attr('data-tooltip-top', DEFAULT_INI_SETTINGS.Bell_Settings.DELAY_TIMEOUT+'s')
		message_input.val(DEFAULT_INI_SETTINGS.Bell_Settings.TEXT_MESSAGE)
	}
	// display clinics
	displayClinics()
	async function displayClinics()
	{
		if ( !clinic_select[0] ) return
		clinic_select.html('')
		var res = await CLINIC_MODEL.search('')
		if ( res.code == 404 ) return

		var data = res.data
		$.each(data, (k,v) =>
		{
			clinic_select.append(`<option value="${v.clinicId}">${v.clinicName}</option>`)
		})
	}
	if ( options.center_type == CENTER_TYPE_CENTER )
	{
		displayEmployeeTypes('')
		BellObject.administration_id = USER_CONFIG.administration.clinicId
	}
	else if ( options.center_type == CENTER_TYPE_CENTRAL_ADMIN )
		displayEmployeeTypes('.')
	// display employee types
	async function displayEmployeeTypes(target_administration)
	{
		var res = await EMPLOYEE_MODEL.types_index(target_administration)
		var data = res.data
	
		var html = ''
		$.each(data, (k,v) =>
		{
			var employee_type_name = (FUI_DISPLAY_LANG.lang == 'ar') ? v.employee_type_name_ar : v.employee_type_name_fr
			html += `<option value="${v.employee_type_id}">${employee_type_name}</option>`
		})

		employee_type_select.html(html)
	}
}
// FullpageDialog
FullpageDialog = function (options = {})
{
	var dialog_container = $('#'+options.container)
	var closeBTN = null
	var html = `<div class="overlay d-flex align-items-center justify-content-center" id="${options.container}" style="transition: none; z-index: 2000;">
					<div class="wrapper border rounded bg-white overflow-hidden shadow overlay-content container-fluid h-100  pb-3 d-flex flex-column block rounded-0 dialog_container">
						<div class="block-header px-0 py-4">
							<button class="btn-close block-btn-close" id="closeBTN"></button>
							<h4 class="h3 dialog_title"></h4>
						</div>
						<div class="block-body position-relative h-100 dialog_body" style="max-height: 93vh; overflow-x:hidden;overflow-y:auto;">
							
						</div>
					</div>
				</div>`

	if ( !dialog_container[0] )
	{
		$(html).insertBefore(MAIN_CONTENT_CONTAINER)

		dialog_container = $('#'+options.container)
	}

	// show
	show()
	init()

	closeBTN = dialog_container.find('#closeBTN')

	closeBTN.off('click')
	.on('click', e =>
	{
		hide()
	})

	// element
	this.getElement = () =>
	{
		return dialog_container
	}
	//
	this.hide = () =>
	{
		hide()
		return this
	}

	// show
	function show()
	{
		dialog_container.addClass('active')
	}
	// hide
	function hide()
	{
		dialog_container.removeClass('active')
	}
	// set title
	function setTitle()
	{
		if ( options.title )
			dialog_container.find('.dialog_title').html(options.title)
	}
	// set html
	function setHtml()
	{
		dialog_container.find('.block-body').html(options.html)
	}
	// set size
	function setSize()
	{
		if ( options.size )
		{
			dialog_container.find('.dialog_container').css('max-width', options.size.maxWidth)
			dialog_container.find('.dialog_container').css('max-height', options.size.maxHeight)
		}
	}
	// init
	function init()
	{
		setTitle()
		setHtml()
		setSize()
	}
}
// SelectEmployeeDialog
SelectEmployeeDialog = async (callback = null) =>
{
	var dialog_container = $('#selectEmployeeDialog');

	if ( !dialog_container[0] )
	{
		$(await (getPage('../views/dialogs/select-employee-dialog.ejs'))).insertBefore(MAIN_CONTENT_CONTAINER)
		dialog_container = $('#selectEmployeeDialog');
	}

	var closeBTN = dialog_container.find('#closeBTN');
	var okBTN = dialog_container.find('#okBTN');
	var cancelBTN = dialog_container.find('#cancelBTN');

	var central_admin_btn = dialog_container.find('#central_admin_btn');
	var center_btn = dialog_container.find('#center_btn');
	var my_contacts_btn = dialog_container.find('#my_contacts_btn');

	var main_wrapper = dialog_container.find('#main_wrapper');

	var central_admin_employees_wrapper = dialog_container.find('#central_admin_employees_wrapper');
	var central_admin_emp_types_select = dialog_container.find('#central_admin_emp_types_select');
	var searchInput1 = dialog_container.find('#searchInput1');
	var pagination1 = dialog_container.find('#pagination1');
	var employeesList1 = dialog_container.find('#employeesList1');

	var center_employees_wrapper = dialog_container.find('#center_employees_wrapper');
	var center_emp_types_select = dialog_container.find('#center_emp_types_select');
	var clinicSelect = dialog_container.find('#clinicSelect');
	var searchInput2 = dialog_container.find('#searchInput2');
	var pagination2 = dialog_container.find('#pagination2');
	var employeesList2 = dialog_container.find('#employeesList2');

	var my_contacts_employees_wrapper = dialog_container.find('#my_contacts_employees_wrapper');
	var select_employee_dialog_my_contacts_employee_job_select = dialog_container.find('#select_employee_dialog_my_contacts_employee_job_select');
	var select_employee_dialog_my_contacts_center_select = dialog_container.find('#select_employee_dialog_my_contacts_center_select');
	var select_employee_dialog_my_contacts_search_btn = dialog_container.find('#select_employee_dialog_my_contacts_search_btn');
	var select_employee_dialog_my_contacts_search_input = dialog_container.find('#select_employee_dialog_my_contacts_search_input');
	var pagination3 = dialog_container.find('#pagination3');
	var employeesList3 = dialog_container.find('#employeesList3');

	var back_btn = dialog_container.find('.back-btn');

	show();

	// closeBTN
	closeBTN.off('click');
	closeBTN.on('click', e =>
	{
		close();
	});
	// cancelBTN
	cancelBTN.off('click');
	cancelBTN.on('click', e =>
	{
		close();
	});
	// central_admin_btn
	central_admin_btn.off('click');
	central_admin_btn.on('click', e =>
	{
		central_admin_employees_wrapper.slideDown(200).siblings('.WRAPPER').slideUp(200);
	});
	// center_btn
	center_btn.off('click');
	center_btn.on('click', e =>
	{
		center_employees_wrapper.slideDown(200).siblings('.WRAPPER').slideUp(200);
	});
	// my_contacts_btn
	my_contacts_btn.off('click');
	my_contacts_btn.on('click', e =>
	{
		my_contacts_employees_wrapper.slideDown(200).siblings('.WRAPPER').slideUp(200);
	});
	// back_btn
	back_btn.off('click');
	back_btn.on('click', e =>
	{
		main_wrapper.slideDown(200).siblings('.WRAPPER').slideUp(200);
	});
	// okBTN
	okBTN.off('click');
	okBTN.on('click', e =>
	{
		
	});
	// searchInput1
	searchInput1.off('keyup');
	searchInput1.on('keyup', e =>
	{
		setTimeout(() => {
			displayCentralAdminEmployees();
		}, 500);
	});
	// searchInput2
	searchInput2.off('keyup');
	searchInput2.on('keyup', e =>
	{
		setTimeout(() => {
			displayClinicEmployees();
		}, 500);
	});
	// dialog_container
	dialog_container.off('click');
	dialog_container.on('click', async e =>
	{
		var target = $(e.target);
		if ( target.data('role') == 'employee' )
		{
			if ( typeof callback == 'function' )
			{

				callback( (await EMPLOYEE_MODEL.show(target.data('id'))).data );
				close();
			}
		}
	});
	// select clininc
	clinicSelect.off('change');
	clinicSelect.on('change', e =>
	{
		displayClinicEmployees();
	});
	// select employee type
	central_admin_emp_types_select.off('change');
	central_admin_emp_types_select.on('change', e =>
	{
		displayCentralAdminEmployeesByType();
	});
	center_emp_types_select.off('change');
	center_emp_types_select.on('change', e =>
	{
		displayClinicEmployeesByType();
	});

	// my contacts
	select_employee_dialog_my_contacts_search_btn.off('click').on('click', e =>
	{
		displayMyContactsEmployees({
			method_type: 'employee_group_for_messaging_search',
			query: select_employee_dialog_my_contacts_search_input.val(),
			advanced: {
				employee_id: USER_CONFIG.employee_id,
				target_administration_id: select_employee_dialog_my_contacts_center_select.find(':selected').val(),
				target_employee_type_id: select_employee_dialog_my_contacts_employee_job_select.find(':selected').val(),
			}
		})
	})
	// display central admin employees
	displayCentralAdminEmployees();
	async function displayCentralAdminEmployees()
	{
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			dialog_container.find('#central_admin_total_emp').text(` فيها حوالي (0) موظف.`);
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			dialog_container.find('#central_admin_total_emp').text(`Elle compte environ (0) employés.`);
		var response = await EMPLOYEE_MODEL.searchLocal({
			query: searchInput1.val(),
			administration_id: 0,
			employee_administration: '.'
		});
		employeesList1.html('');
		if ( response.code == 404 )
		{
			return;
		}

		var data = response.data;
		var html = '';

		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			dialog_container.find('#central_admin_total_emp').text(` فيها حوالي (${data.length}) موظف.`);
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			dialog_container.find('#central_admin_total_emp').text(`Elle compte environ (${data.length}) employés.`);

		$.each(data, (k,v) =>
		{
			if (FUI_DISPLAY_LANG.lang == 'ar'  )
			{
				html += `<div class="col-12">

							<div class="card" data-role="employee" data-id="${v.employee_id}" data-name="${v.employee_name}" data-phone="${v.employee_phone}" style="cursor:pointer;">
								<div class="card-body no-pointer">
									<h4 class="card-title text-01">${v.employee_name}</h4>
									<p class="card-text"><small>${v.employee_phone}</small></p>
									<hr>
									<p class="card-text">${v.type.employee_type_name_ar}</p>
								</div>
							</div>

						</div>PAG_SEP `;
			}
			else if (FUI_DISPLAY_LANG.lang == 'fr'  )
			{
				html += `<div class="col-12">

							<div class="card" data-role="employee" data-id="${v.employee_id}" data-name="${v.employee_name}" data-phone="${v.employee_phone}" style="cursor:pointer;">
								<div class="card-body no-pointer">
									<h4 class="card-title text-01">${v.employee_name}</h4>
									<p class="card-text"><small>${v.employee_phone}</small></p>
									<hr>
									<p class="card-text">${v.type.employee_type_name_fr}</p>
								</div>
							</div>

						</div>PAG_SEP `;
			}
		});

		new SmoothPagination(pagination1, employeesList1, {
			data: html.split('PAG_SEP'),
			
		})

	}
	// display clinincs
	displayClinics();
	async function displayClinics()
	{
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			dialog_container.find('#centers_total').text(` فيها حوالي (0) موظف.`);
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			dialog_container.find('#centers_total').text(`Elle compte environ (0) employés.`);
		var response = await CLINIC_MODEL.search('');
		
		if ( response.code == 404 )
		{
			return;
		}

		var data = response.data;
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			dialog_container.find('#centers_total').text(` حوالي (${data.length}) مراكز فرعية.`);
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			dialog_container.find('#centers_total').text(`Environ (${data.length}) sous-centres`);

		var html = '';
		$.each(data, (k,v) =>
		{
			html += `<option value="${v.clinicId}">${v.clinicName}</option>`;
		});

		clinicSelect.html(html);
		clinicSelect.trigger('change');
	}
	// display clinic eployees
	async function displayClinicEmployees()
	{
		var response = await EMPLOYEE_MODEL.searchLocal({
			query: searchInput2.val(),
			administration_id: clinicSelect.find(':selected').val(),
		});
		employeesList2.html('');
		if ( response.code == 404 )
		{
			return;
		}

		var data = response.data;
		var html = '';

		$.each(data, (k,v) =>
		{
			if (FUI_DISPLAY_LANG.lang == 'ar'  )
			{
				html += `<div class="col-12">

							<div class="card" data-role="employee" data-id="${v.employee_id}" data-name="${v.employee_name}" data-phone="${v.employee_phone}" style="cursor:pointer;">
								<div class="card-body no-pointer">
									<h4 class="card-title text-01">${v.employee_name}</h4>
									<p class="card-text"><small>${v.employee_phone}</small></p>
									<hr>
									<p class="card-text">${v.type.employee_type_name_ar}</p>
								</div>
							</div>

						</div>PAG_SEP `;
			}
			else if (FUI_DISPLAY_LANG.lang == 'fr'  )
			{
				html += `<div class="col-12">

							<div class="card" data-role="employee" data-id="${v.employee_id}" data-name="${v.employee_name}" data-phone="${v.employee_phone}" style="cursor:pointer;">
								<div class="card-body no-pointer">
									<h4 class="card-title text-01">${v.employee_name}</h4>
									<p class="card-text"><small>${v.employee_phone}</small></p>
									<hr>
									<p class="card-text">${v.type.employee_type_name_fr}</p>
								</div>
							</div>

						</div>PAG_SEP `;
			}
		});

		new SmoothPagination(pagination2, employeesList2, {
			data: html.split('PAG_SEP'),
			
		})

	}
	// display central admin employees by type
	async function displayCentralAdminEmployeesByType()
	{
		var response = await filterEmployeeByTypeLocal({
			employee_type_code: central_admin_emp_types_select.find(':selected').val(),
			administration_id: 0,
			employee_administration: '.'
		});
		employeesList1.html('');
		if ( response.code == 404 )
		{
			return;
		}

		var data = response.data;
		var html = '';

		$.each(data, (k,v) =>
		{
			if (FUI_DISPLAY_LANG.lang == 'ar'  )
			{
				html += `<div class="col-12">

							<div class="card" data-role="employee" data-id="${v.employee_id}" data-name="${v.employee_name}" data-phone="${v.employee_phone}" style="cursor:pointer;">
								<div class="card-body no-pointer">
									<h4 class="card-title text-01">${v.employee_name}</h4>
									<p class="card-text"><small>${v.employee_phone}</small></p>
									<hr>
									<p class="card-text">${v.type.employee_type_name_ar}</p>
								</div>
							</div>

						</div>PAG_SEP `;
			}
			else if (FUI_DISPLAY_LANG.lang == 'fr'  )
			{
				html += `<div class="col-12">

							<div class="card" data-role="employee" data-id="${v.employee_id}" data-name="${v.employee_name}" data-phone="${v.employee_phone}" style="cursor:pointer;">
								<div class="card-body no-pointer">
									<h4 class="card-title text-01">${v.employee_name}</h4>
									<p class="card-text"><small>${v.employee_phone}</small></p>
									<hr>
									<p class="card-text">${v.type.employee_type_name_fr}</p>
								</div>
							</div>

						</div>PAG_SEP `;
			}
		});

		new SmoothPagination(pagination1, employeesList1, {
			data: html.split('PAG_SEP'),
			
		})

	}
	// display clinic eployees by type
	async function displayClinicEmployeesByType()
	{
		var response = await filterEmployeeByTypeLocal({
			employee_type_code: center_emp_types_select.find(':selected').val(),
			administration_id: clinicSelect.find(':selected').val(),
		});
		employeesList2.html('');
		if ( response.code == 404 )
		{
			return;
		}

		var data = response.data;
		var html = '';

		$.each(data, (k,v) =>
		{
			if (FUI_DISPLAY_LANG.lang == 'ar'  )
			{
				html += `<div class="col-12">

							<div class="card" data-role="employee" data-id="${v.employee_id}" data-name="${v.employee_name}" data-phone="${v.employee_phone}" style="cursor:pointer;">
								<div class="card-body no-pointer">
									<h4 class="card-title text-01">${v.employee_name}</h4>
									<p class="card-text"><small>${v.employee_phone}</small></p>
									<hr>
									<p class="card-text">${v.type.employee_type_name_ar}</p>
								</div>
							</div>

						</div>PAG_SEP `;
			}
			else if (FUI_DISPLAY_LANG.lang == 'fr'  )
			{
				html += `<div class="col-12">

							<div class="card" data-role="employee" data-id="${v.employee_id}" data-name="${v.employee_name}" data-phone="${v.employee_phone}" style="cursor:pointer;">
								<div class="card-body no-pointer">
									<h4 class="card-title text-01">${v.employee_name}</h4>
									<p class="card-text"><small>${v.employee_phone}</small></p>
									<hr>
									<p class="card-text">${v.type.employee_type_name_fr}</p>
								</div>
							</div>

						</div>PAG_SEP `;
			}
		});

		new SmoothPagination(pagination2, employeesList2, {
			data: html.split('PAG_SEP'),
			
		})

	}
	// display my contacts employees
	displayMyContactsEmployees({
		method_type: 'employee_group_for_messaging_search',
		query: select_employee_dialog_my_contacts_search_input.val(),
		advanced: {
			employee_id: USER_CONFIG.employee_id
		}
	})
	async function displayMyContactsEmployees(params)
	{
		employeesList3.html('')

		if ( FUI_DISPLAY_LANG.lang == 'ar' ) dialog_container.find('#my_contacts_total').text(` يوجد حوالي (0) موظف.`);
		else if ( FUI_DISPLAY_LANG.lang == 'fr' ) dialog_container.find('#my_contacts_total').text(`Il y a environ (0) employés.`);

		if ( params.method_type == 'employee_group_for_messaging_search' ) var res = await EMPLOYEE_MODEL.employee_group_for_messaging_search(params)

		if ( res.code == 404 ) return
		var data = res.data
		var html = ''

		if ( FUI_DISPLAY_LANG.lang == 'ar' ) dialog_container.find('#my_contacts_total').text(` يوجد حوالي (${data.length}) موظف.`);
		else if ( FUI_DISPLAY_LANG.lang == 'fr' ) dialog_container.find('#my_contacts_total').text(`Il y a environ (${data.length}) employés.`);

		$.each(data, (k,v) =>
		{
			html += `<div class="col-12">

						<div class="card" data-role="employee" data-id="${v.target_employee_id}" data-name="${v.target_employee_name}" data-phone="${v.target_employee_phone}" style="cursor:pointer;">
							<div class="card-body no-pointer">
								<h4 class="card-title text-01">${v.target_employee_name}</h4>
								<p class="card-text"><small>${v.target_employee_phone}</small></p>
								<hr>
								<p class="card-text">${FUI_DISPLAY_LANG.views.pages.global.employee_type_codes[v.target_employee_type_code]}</p>
							</div>
						</div>

					</div>PAG_SEP `;
		});

		new SmoothPagination(pagination3, employeesList3, {
			data: html.split('PAG_SEP'),
			
		})
	}
	// display employee types
	displayEmployeeTypes();
	async function displayEmployeeTypes()
	{
		central_admin_emp_types_select.html('');
		center_emp_types_select.html('');
		var response = await EMPLOYEE_MODEL.types_index('all');
		if ( response.code == 404 )
			return;

		var data = response.data;
		$.each(data, (k,v) =>
		{
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
			{
				if ( v.employee_type_target_center == EMP_TYPE_TARGET_CENTER_CENTRAL_ADMINISTRATION )
				{
					central_admin_emp_types_select.append(`<option value="${v.employee_type_code}">${v.employee_type_name_ar}</option>`);
				}
				else if ( v.employee_type_target_center == EMP_TYPE_TARGET_CENTER_CLINIC )
				{
					center_emp_types_select.append(`<option value="${v.employee_type_code}">${v.employee_type_name_ar}</option>`);
				}
			}
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			{
				if ( v.employee_type_target_center == EMP_TYPE_TARGET_CENTER_CENTRAL_ADMINISTRATION )
				{
					central_admin_emp_types_select.append(`<option value="${v.employee_type_code}">${v.employee_type_name_fr}</option>`);
				}
				else if ( v.employee_type_target_center == EMP_TYPE_TARGET_CENTER_CLINIC )
				{
					center_emp_types_select.append(`<option value="${v.employee_type_code}">${v.employee_type_name_fr}</option>`);
				}
			}
		});

		// central_admin_emp_types_select.trigger('change');
		// center_emp_types_select.trigger('change');
	}
	// Display dialog
	function show()
	{
		dialog_container.addClass('active');
		MAIN_CONTENT_CONTAINER.addClass('blur');
		SIDE_NAV_CONTAINER.addClass('blur');
		TOP_NAV_BAR.addClass('blur');
	}
	// Close dialog
	function close()
	{
		dialog_container.removeClass('active');
		MAIN_CONTENT_CONTAINER.removeClass('blur');
		SIDE_NAV_CONTAINER.removeClass('blur');
		TOP_NAV_BAR.removeClass('blur');
	}
}
// Add Consommables To Patient Dialog
AddConsommablesToPatientDialog = (options, CALLBACK = undefined) =>
{
	var promptDialogContainer = $('#addConsommablesToPatientDialog');
	var ERROR_BOX = promptDialogContainer.find('#ERROR_BOX');
	var closeBTN = promptDialogContainer.find('#closeBTN');
	var submitBTN = promptDialogContainer.find('#submitBTN');
	var patientName = promptDialogContainer.find('#patientName');

	var searchBTN = promptDialogContainer.find('#searchBTN');
	var searchInput = promptDialogContainer.find('#searchInput');
	var tableElement = promptDialogContainer.find('#tableElement');

	var wrapper01 = promptDialogContainer.find('#wrapper01');

	show();
	patientName.text('('+options.patientName+')');
	// close
	closeBTN.off('click');
	closeBTN.on('click', e =>
	{
		hide();
	});
	// submit
	submitBTN.off('click');
	submitBTN.on('click', async e =>
	{
		// check length
		if ( selectedConsommables().length == 0 ) return

		// display loader
		SectionLoader(wrapper01);

		var response = await CONSOMMABLE_MODEL.patient_batchStore({
			patientId: options.patientId,
			patientName: options.patientName,
			administration_id: options.administration_id,
			administration_name: options.administration_name,
			ConsommableObjects: selectedConsommables()
		});
		// hide loader
		SectionLoader(wrapper01, '');
		if ( response.code == 404 )
		{
			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			return;
		}
		ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
		searchBTN.trigger('click');
		if ( typeof CALLBACK == 'function' )
			CALLBACK(response);
	});
	// search
	searchBTN.off('click');
	searchBTN.on('click', async e =>
	{
		var SearchObject = {
			administration_id: options.administration_id,
			query: searchInput.val()
		};
		// display loader
		SectionLoader(tableElement);
		var response = await CONSOMMABLE_MODEL.center_local_search(SearchObject);
		// hide loader
		SectionLoader(tableElement, '');
		// clear html
		tableElement.html('');
		if ( response.code == 404 )
		{
			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			return;
		}

		var data = response.data;
		var html = '';
		$.each(data, (k,v) =>
		{
			html += `<div class="py-3 border-bottom">
						<div class="d-flex is-justify-content-space-between is-align-items-center" data-role="CONSOMMABLE" data-consommable-id="${v.consommable_id}" data-consommable-name="${v.consommable_name}" data-center-quantity="${v.consommable_quantity}">
							<div>
								<div class="">
									<input type="checkbox" class="form-check-input pointer" data-role="CHECK" data-consommable_id="${v.consommable_id}">
									<span class="text-02">
										${v.consommable_name}
										<span class="display-inline-block mx-2 text-04 text-muted">
											(${v.consommable_quantity})
										</span>
									</span>
								</div>
							</div>
							<div>
								<span>
									<input type="number" style="width: 101px;" class="input-text input-text-outline pointer" data-role="QUANTITY" data-consommable_id="${v.consommable_id}" value="1" min="1" max="${v.consommable_quantity}">
								</span>
							</div>
						</div>
					</div>`;
		});
		// add html
		tableElement.html(html);
	});
	searchBTN.trigger('click');
	// show
	function show()
	{
		promptDialogContainer.addClass('active');
		MAIN_CONTENT_CONTAINER.addClass('blur');
		SIDE_NAV_CONTAINER.addClass('blur');
		TOP_NAV_BAR.addClass('blur');
	}
	// hide
	function hide()
	{
		promptDialogContainer.removeClass('active');
		MAIN_CONTENT_CONTAINER.removeClass('blur');
		SIDE_NAV_CONTAINER.removeClass('blur');
		TOP_NAV_BAR.removeClass('blur');
	}
	// selected Consommables
	function selectedConsommables()
	{
		var list = [];
		var items = tableElement.find('[data-role="CONSOMMABLE"]');
		for (var i = 0; i < items.length; i++) 
		{
			var item = $(items[i]);
			var check = item.find('[data-role="CHECK"]');
			var quantity_input = item.find('[data-role="QUANTITY"]')
			var quantity = parseInt(quantity_input.val());
			var center_quantity = parseInt(item.data('center-quantity'))
			// check center stock quantity
			if ( quantity > center_quantity )
			{
				quantity_input.addClass('input-danger')
				continue
			}
			else
				quantity_input.removeClass('input-danger')

			if ( check.is(':checked') )
			{
				list.push({ 
					administration_id: options.administration_id,
					administration_name: options.administration_name,
					consommable_id: item.data('consommable-id'),
					consommable_name: item.data('consommable-name'),
					consommable_quantity: quantity
				});
			}
		}

		return list;
	}
}
// Preview File Dialog
PreviewFileDialog = (options, callback) =>
{
	var previewFileDialog = $('#previewFileDialog');
	var closeBTN = previewFileDialog.find('#closeBTN');

	var bodyDiv = previewFileDialog.find('#bodyDiv');
	const file_div = previewFileDialog.find('#file_div');

	const image_editing_options = previewFileDialog.find('#image_editing_options')
	const rotate_button = previewFileDialog.find('#rotate_button')

	const confirm_button = previewFileDialog.find('#confirm_button')

	show();
	// check file type
	if ( isImageFile(options.url) )
	{
		file_div.html(`<img src="${options.url}" class="" alt="">`);
		image_editing_options.removeClass('d-none')
	}
	else image_editing_options.addClass('d-none')

	if ( isPDFFile(options.url) )
	{
		file_div.html(`<iframe src="${options.url}" class="iframe-fit" frameborder="0" scrolling="true"></iframe>`);
	}
	draggableScroll(file_div);
	// close
	closeBTN.off('click');
	closeBTN.on('click', e =>
	{
		hide();
	});
	// Image editing options
	// Rotate
	var rotateDegrees = 90
	rotate_button.off('click');
	rotate_button.on('click', e =>
	{
		rotateImage(options.url, rotateDegrees, rotatedImgUrl =>
		{
			file_div.find('img').attr('src', rotatedImgUrl)
		})

		rotateDegrees += 90
	})
	// confirm
	confirm_button.off('click');
	confirm_button.on('click', e =>
	{

		if ( typeof callback == 'function' )
		{
			callback({
				url: file_div.find('img').attr('src')
			})
			hide()
		}
		
	})
	//
	function show()
	{
		previewFileDialog.addClass('active');
	}
	function hide()
	{
		previewFileDialog.removeClass('active');
	}
}
// Orders Cart Dialog
OrdersCartDialog = (options = {}, callback = null) =>
{
	var ordersCartDialog = $('#ordersCartDialog');
	var ERROR_BOX = ordersCartDialog.find('#ERROR_BOX');
	var CLOSE_BTN = ordersCartDialog.find('#CLOSE_BTN');
	var MINIMIZE_BTN = ordersCartDialog.find('#MINIMIZE_BTN');
	var RESTORE_BTN = ordersCartDialog.find('#RESTORE_BTN');
	var VIEW_ORDERS_BTN = ordersCartDialog.find('#VIEW_ORDERS_BTN');
	var ORDERS_LIST = ordersCartDialog.find('#ORDERS_LIST');
	var SEND_CART_ORDER_BTN = ordersCartDialog.find('#SEND_CART_ORDER_BTN');
	var SEND_CART_ORDER_BTN2 = ordersCartDialog.find('#SEND_CART_ORDER_BTN2');
	var TOTAL = ordersCartDialog.find('#TOTAL');
	var TOTAL_MINIMIZED = ordersCartDialog.find('#TOTAL_MINIMIZED');
	var AMOUNT_PAID_INPUT = ordersCartDialog.find('#AMOUNT_PAID_INPUT');
	var DEPT_AMOUNT = ordersCartDialog.find('#DEPT_AMOUNT');

	var TABS_LIST = ordersCartDialog.find('#TABS_LIST');

	var patientsSearchInput = ordersCartDialog.find('#patientsSearchInput');
	var patientSelect = ordersCartDialog.find('#patientSelect');
	var loader01 = ordersCartDialog.find('#loader01');

	var patientNameInput = ordersCartDialog.find('#patientNameInput');
	var patientPhoneInput = ordersCartDialog.find('#patientPhoneInput');

	// show
	show();
	// add order to list
	append();
	// switch tabs
	TABS_LIST.off('click');
	TABS_LIST.on('click', e =>
	{
		var target = $(e.target);
		if ( target.data('role') == 'TAB' )
		{
			var tab = ordersCartDialog.find( target.data('tab') );
			tab.show(0).siblings('.TAB').hide(0);
			target.addClass('active').siblings().removeClass('active');

			if ( target.data('tab') == '#OUTSIDE_ORDER_TAB' )
				AMOUNT_PAID_INPUT.attr('readonly', true)
			else
				AMOUNT_PAID_INPUT.attr('readonly', false)
		}
	});
	// ORDERS_LIST click
	ORDERS_LIST.off('click');
	ORDERS_LIST.on('click', e =>
	{
		var target = $(e.target);

		if ( target.data('role') == 'REMOVE' )
		{
			var parent = target.closest('.order');
			parent.remove();
			calculateTotal();
		}
	});
	// display orders list 
	VIEW_ORDERS_BTN.off('click');
	VIEW_ORDERS_BTN.on('click', e =>
	{
		var visible = ORDERS_LIST.data('visible');

		if ( visible )
		{
			ORDERS_LIST.slideUp(200).data('visible', false)
			VIEW_ORDERS_BTN.text( FUI_DISPLAY_LANG.views.pages.global.text7 )
		}
		else
		{
			ORDERS_LIST.slideDown(200).data('visible', true)
			VIEW_ORDERS_BTN.text( FUI_DISPLAY_LANG.views.pages.global.text8 )
		}

	});
	// close
	CLOSE_BTN.off('click');
	CLOSE_BTN.on('click', e =>
	{
		hide();
	});
	// minimize
	MINIMIZE_BTN.off('click');
	MINIMIZE_BTN.on('click', e =>
	{
		minimize();
	});
	// restore
	RESTORE_BTN.off('click');
	RESTORE_BTN.on('click', e =>
	{
		restore();
	});
	// SEND_CART_ORDER_BTN click
	SEND_CART_ORDER_BTN.off('click');
	SEND_CART_ORDER_BTN.on('click', async e =>
	{
		var user_id = patientSelect.find(':selected').val();
		var order_receiver_name = patientSelect.find(':selected').text();
		var order_amount_paid = parseFloat(AMOUNT_PAID_INPUT.val())
		var order_total_amount = calculateTotal()
		var order_dept_amount = 0

		if ( order_amount_paid > 0 )
		{
			order_dept_amount = order_total_amount - order_amount_paid
		}

		SEND_CART_ORDER_BTN.addClass('disabled')
		var response = await ORDER_MODEL.direction_center_to_client_selling_store({
			items: selectedItems(),
			supplier_id: USER_CONFIG.administration.clinicId,
        	supplier_name: USER_CONFIG.administration.clinicName,
			user_id: user_id,
			order_receiver_name: order_receiver_name,
			prescriptionId: options.prescriptionId,
			order_amount_paid: order_amount_paid,
			order_total_amount: order_total_amount,
			order_dept_amount: order_dept_amount,
			isAccepted: 1
		});
		SEND_CART_ORDER_BTN.removeClass('disabled')
		ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
		if ( response.code == 404 ) return

		if ( typeof callback == 'function' )
			callback(response)
		//hide();
		clearItems();
		options.prescriptionId = null
	});
	// SEND_CART_ORDER_BTN2 click
	SEND_CART_ORDER_BTN2.off('click');
	SEND_CART_ORDER_BTN2.on('click', async e =>
	{
		var order_receiver_name = patientNameInput.val()
		var order_receiver_phone = patientPhoneInput.val()
		var order_amount_paid = parseFloat(AMOUNT_PAID_INPUT.val())
		var order_total_amount = calculateTotal()

		// no depts allowed
		AMOUNT_PAID_INPUT.val(order_total_amount)
		order_amount_paid = order_total_amount

		SEND_CART_ORDER_BTN2.addClass('disabled')
		var response = await ORDER_MODEL.direction_center_to_external_client_selling_store({
			items: selectedItems(),
			supplier_id: USER_CONFIG.administration.clinicId,
        	supplier_name: USER_CONFIG.administration.clinicName,
			order_receiver_name: order_receiver_name,
			order_receiver_phone: order_receiver_phone,
			order_amount_paid: order_amount_paid,
			order_total_amount: order_total_amount,
			isAccepted: 1
		});
		SEND_CART_ORDER_BTN2.removeClass('disabled')
		ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);

		if ( response.code == 404 ) return

		if ( typeof callback == 'function' )
			callback(response)
		//hide();
		clearItems();
		// options.prescriptionId = null
	});
	// search patients
	patientsSearchInput.off('keyup');
	patientsSearchInput.on('keyup', async e =>
	{
		var query = patientsSearchInput.val();
		var SearchObject = {
			clinicId: USER_CONFIG.administration.clinicId,
			query: query
		};
		// display loader
		loader01.show(0);
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			loader01.text("جاري البحث...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			loader01.text("En train de rechercher...");

		var response = await searchPatientsLocal(SearchObject);
		// hide loader
		loader01.hide(0);
		if ( response.code == 404 )
			return;

		var data = response.data;
		var html = '';
		$.each(data, (k,v) =>
		{
			html += `<option value="${v.patientId}">${v.patientName}</option>`;
		});
		// add html
		patientSelect.html(html);
		if ( options.user_id != null )
		{
			setOptionSelected(patientSelect, options.user_id);
		}	
		patientSelect.trigger('change');
	});
	// trigger patients search
	patientsSearchInput.trigger('keyup');
	// show
	function show()
	{
		ordersCartDialog.addClass('active');	
	}
	// hide
	function hide()
	{
		ordersCartDialog.removeClass('active');
		ORDERS_LIST.slideUp(200).data('visible', false);
		VIEW_ORDERS_BTN.text(FUI_DISPLAY_LANG.views.pages.global.text7);

	}
	// minimize
	function minimize()
	{
		ordersCartDialog.addClass('minimized');	
	}
	// restore
	function restore()
	{
		ordersCartDialog.removeClass('minimized');	
	}
	// append
	function append()
	{
		// check item exists
		var order_item_final_amount = parseFloat(options.price * options.quantity).toFixed(2)
		var order_item_quantity = options.quantity
		var item = checkItemExists(options.id)
		if ( item )
		{
			order_item_quantity = (options.quantity + item.order_item_quantity)
			order_item_final_amount = parseFloat(options.price * order_item_quantity ).toFixed(2)
			ORDERS_LIST.find(`[data-itemid="${options.id}"]`).remove()
		}

		// compare stock quantity with cart
		if ( options.stock_quantity < order_item_quantity )
		{
			CreateToast('PS', 
				`${FUI_DISPLAY_LANG.views.messages.invalid_inventory_quantity}, ${FUI_DISPLAY_LANG.views.pages.global.text12} [<span class="text-success">(${options.stock_quantity})</span>]`
				, '')
			calculateTotal();
			return
		}
		
		var html = `<div class="order" data-role="ORDER_ITEM" data-itemid="${options.id}">
						<div class="cart-btn-close" data-role="REMOVE" style="background: transparent;">
							&times;
						</div>
						<div class="text-center row gx-0 gy-0">
							<div class="col-md-2 d-flex align-items-center">
								<img src="${options.image}" alt="" class="order-img">
							</div>
							<div class="col-md d-flex align-items-center">
								<div class="order-name fw-300">${ strSnippet(options.name) }</div>
							</div>
							<div class="col-md-3">
								<div class="text-muted fw-200 mb-1 order-price" data-role="ITEM_PRICE" data-price="${options.price}">
									<span class="text-success">${options.price}</span>
								</div>
								<div class="text-muted fw-200 order-quantity has-direction-ltr" data-role="ITEM_QUANTITY" data-quantity="${order_item_quantity}">
									<div class="mb-2">${options.price} x ${order_item_quantity}</div>
									<div>= <span class="text-success">${order_item_final_amount}</span></div>
								</div>
							</div>
						</div>
					</div>`;
		ORDERS_LIST.append(html);
		calculateTotal();
	}
	// selected items
	function selectedItems()
	{
		var list = [];
		var items = ORDERS_LIST.find('[data-role="ORDER_ITEM"]');
		for (var i = 0; i < items.length; i++) 
		{
			var item = $(items[i]);
			list.push({
				order_item_id: item.data('itemid'),
				order_item_quantity: parseInt(item.find('[data-role="ITEM_QUANTITY"]').data('quantity')),
				order_item_price: parseFloat(item.find('[data-role="ITEM_PRICE"]').data('price')),
				order_note: ''
			});
		}

		return list;
	}
	// clear items
	function clearItems()
	{
		ORDERS_LIST.html('');
		ORDERS_LIST.slideUp(200).data('visible', false);
		VIEW_ORDERS_BTN.text(FUI_DISPLAY_LANG.views.pages.global.text7);
		TOTAL.html(`${FUI_DISPLAY_LANG.views.pages.global.text13} <span class="text-success">${0.00} ${CURRENCY.dzd}</span>`);
		TOTAL_MINIMIZED.html( TOTAL.html() )
	}
	// calculate total
	function calculateTotal()
	{
		var items = selectedItems();
		var total = 0;
		for (var i = 0; i < items.length; i++) 
		{
			var item = items[i];
			total += item.order_item_price * item.order_item_quantity;
		}

		TOTAL.html(`${FUI_DISPLAY_LANG.views.pages.global.text13} <span class="text-success">${total.toFixed(2)} ${CURRENCY.dzd}</span>`);
		TOTAL_MINIMIZED.html( TOTAL.html() )

		return total
	}
	// check item exists
	function checkItemExists(id)
	{
		var result = false
		var items = selectedItems()
		for (let i = 0; i < items.length; i++) 
		{
			const item = items[i];
			if ( item.order_item_id == id )
			{
				result = item
				break
			}
		}

		return result;
	}
}
// Order Cart Dialog
OrderCartDialog = (options, callback) =>
{
	var orderCartDialog = $('#orderCartDialog');
	var PRODUCT_IMAGE = orderCartDialog.find('#PRODUCT_IMAGE');
	var PRODUCT_NAME = orderCartDialog.find('#PRODUCT_NAME');
	var PRODUCT_PRICE = orderCartDialog.find('#PRODUCT_PRICE');
	var GO_BACK_BTN = orderCartDialog.find('#GO_BACK_BTN');
	var ADD_TO_CART_BTN = orderCartDialog.find('#ADD_TO_CART_BTN');

	var MINUS_QUANTITY_BTN = orderCartDialog.find('#MINUS_QUANTITY_BTN');
	var QUANTITY_INPUT = orderCartDialog.find('#QUANTITY_INPUT');
	var PLUS_QUANTITY_BTN = orderCartDialog.find('#PLUS_QUANTITY_BTN');

	// show
	show();
	PRODUCT_IMAGE.attr('src', options.image);
	PRODUCT_NAME.text(options.name);
	PRODUCT_PRICE.text(options.price+' '+CURRENCY.dzd);

	QUANTITY_INPUT.val(1);
	// close
	GO_BACK_BTN.off('click');
	GO_BACK_BTN.on('click', e =>
	{
		hide();
	});
	// add to cart
	ADD_TO_CART_BTN.off('click');
	ADD_TO_CART_BTN.on('click', async e =>
	{

		ADD_TO_CART_BTN.addClass('disabled')
		// check product quantity
		var res = await PRODUCT_MODEL.center_show({
			productId: options.id,
			administration_id: options.administration_id,
		})
		ADD_TO_CART_BTN.removeClass('disabled')
		var itemData = res.data
		var quantity = parseInt(QUANTITY_INPUT.val())
		var stock_quantity = parseInt(itemData.productQuantity)

		if ( stock_quantity == 0 || stock_quantity < quantity )
		{
			CreateToast('PS', 
				`${FUI_DISPLAY_LANG.views.messages.invalid_inventory_quantity}, ${FUI_DISPLAY_LANG.views.pages.global.text12} [<span class="text-success">(${itemData.productQuantity})</span>]`
				, '')
			return
		}

		hide();
		var sellPrice = options.price;
		OrdersCartDialog({
			id: options.id,
			image: options.image,
			name: options.name,
			price: sellPrice,
			quantity: quantity,
			stock_quantity: stock_quantity,
			itemData: itemData,
			prescriptionId: (options.prescriptionId) ? options.prescriptionId : 0
		}, cartRes =>
		{
			callback(cartRes)
		});
	});
	// plus
	PLUS_QUANTITY_BTN.off('click');
	PLUS_QUANTITY_BTN.on('click', e =>
	{
		var q = QUANTITY_INPUT.val();
		q++;
		QUANTITY_INPUT.val(q);
		if ( q > 0 )
			MINUS_QUANTITY_BTN.removeClass('disabled');
	});
	// minus
	MINUS_QUANTITY_BTN.off('click');
	MINUS_QUANTITY_BTN.on('click', e =>
	{
		var q = QUANTITY_INPUT.val();
		q--;
		QUANTITY_INPUT.val(q);
		if ( q == 1 )
			MINUS_QUANTITY_BTN.addClass('disabled');
	});

	// show
	function show()
	{
		orderCartDialog.addClass('active');
		SIDE_NAV_CONTAINER.addClass('blur-5');
		TOP_NAV_BAR.addClass('blur-5');
		MAIN_CONTENT_CONTAINER.addClass('blur-5');
	}
	// hide
	function hide()
	{
		orderCartDialog.removeClass('active');
		SIDE_NAV_CONTAINER.removeClass('blur-5');
		TOP_NAV_BAR.removeClass('blur-5');
		MAIN_CONTENT_CONTAINER.removeClass('blur-5');
	}
}
// Add Appointement Patients Dialog
AddAppointementPatientsDialog = (options, CALLBACK) =>
{
	var promptDialogContainer = $('#addSessionPatientsDialog');
	var ERROR_BOX = promptDialogContainer.find('#ERROR_BOX');
	var closeBTN = promptDialogContainer.find('#closeBTN');
	var submitBTN = promptDialogContainer.find('#submitBTN');
	var sessionName = promptDialogContainer.find('#sessionName');

	var searchBTN = promptDialogContainer.find('#searchBTN');
	var searchInput = promptDialogContainer.find('#searchInput');
	var tableElement = promptDialogContainer.find('#tableElement');

	var wrapper01 = promptDialogContainer.find('#wrapper01');

	show();
	sessionName.text('('+options.aptName+')');
	// close
	closeBTN.off('click');
	closeBTN.on('click', e =>
	{
		hide();
	});
	// submit
	submitBTN.off('click');
	submitBTN.on('click', async e =>
	{
		var AppointementObject = {
			aptId: options.aptId,
			patients: selectedPatients()
		};
		// display loader
		SectionLoader(wrapper01);
		var response = await APPOINTMENT_MODEL.followup_session_patient_batchStore(AppointementObject);
		// hide loader
		SectionLoader(wrapper01, '');
		if ( response.code == 404 )
		{
			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			return;
		}
		ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);

		if ( typeof CALLBACK == 'function' )
			CALLBACK(response);
	});
	// search
	searchBTN.off('click');
	searchBTN.on('click', async e =>
	{
		// display loader
		SectionLoader(tableElement);
		if ( options.clinicId == 'all' )
		{
			var response = await searchPatients(searchInput.val());
		}
		else
		{
			var response = await searchPatientsLocal({
				clinicId: options.clinicId,
				query: searchInput.val()
			});
		}
		// hide loader
		SectionLoader(tableElement, '');
		// clear html
		tableElement.html('');
		if ( response.code == 404 )
		{
			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			return;
		}

		var data = response.data;
		var html = '';
		$.each(data, (k,v) =>
		{
			html += `<div class="list-item d-flex flex-align-center">
						<div class="mx-2">
							<input type="checkbox" class="form-check-input pointer" data-role="CHECK" data-patientid="${v.patientId}">
						</div>
						<div class="text-02 mx-4" style="flex-grow: 1;">
							${v.patientName}
						</div>
					</div>`;
		});
		// add html
		tableElement.html(html);
	});
	searchBTN.trigger('click');
	// show
	function show()
	{
		promptDialogContainer.addClass('active');
		MAIN_CONTENT_CONTAINER.addClass('blur');
		SIDE_NAV_CONTAINER.addClass('blur');
		TOP_NAV_BAR.addClass('blur');
	}
	// hide
	function hide()
	{
		promptDialogContainer.removeClass('active');
		MAIN_CONTENT_CONTAINER.removeClass('blur');
		SIDE_NAV_CONTAINER.removeClass('blur');
		TOP_NAV_BAR.removeClass('blur');
	}
	// selected patients
	function selectedPatients()
	{
		var list = [];
		var items = tableElement.find('[data-role="CHECK"]');
		for (var i = 0; i < items.length; i++) 
		{
			var check = $(items[i]);
			if ( check.is(':checked') )
				list.push({ patientId: check.data('patientid') });
		}

		return list;
	}
}
// Dialog Box
DialogBox = (title = '', html) =>
{
	var modalDialogBoxTogglerBTN = $('#modalDialogBoxTogglerBTN');
	var modalDialogBox = $('#modalDialogBox');
	var mbdTitle = modalDialogBox.find('#mbdTitle');
	var mdbBody = modalDialogBox.find('#mdbBody');
	// Display
	modalDialogBoxTogglerBTN.trigger('click');
	// Set Title
	mbdTitle.html(title);
	// Set HTML
	mdbBody.html(html);
	// change text direction
	if ( FUI_DISPLAY_LANG.lang == 'fr' )
	{
		mdbBody.closest('.modal').removeClass('text-align-r');
	}
}
// Prompt Input dialog
PromptInputDialog = (title, placeholder = 'Enter text here...') =>
{
	var promptDialogContainer = $('#promptInputDialog');
	var promptDialogTitle = promptDialogContainer.find('.block-title');
	var promptDialogCloseBTN = promptDialogContainer.find('#closeBTN');
	var promptDialogTextInput = promptDialogContainer.find('#promptDialogTextInput');
	var promptDialogOK = promptDialogContainer.find('#okBTN');
	var promptDialogCancel = promptDialogContainer.find('#cancelBTN');

	// change text direction
	if ( FUI_DISPLAY_LANG.lang == 'fr' )
	{
		promptDialogContainer.removeClass('text-align-r');
	}
	var promise = new Promise((resolve, reject) =>
	{
		// Display dialog
		show();
		// Set title
		promptDialogTitle.text(title);
		// Set input placeholder
		promptDialogTextInput.attr('placeholder', placeholder);
		//CLose dialog
		promptDialogCloseBTN.off('click');
		promptDialogCloseBTN.on('click', e =>
		{
			e.preventDefault();
			close();
		});

		// Click OK
		promptDialogOK.off('click');
		promptDialogOK.on('click', () =>
		{
			// Close dialog
			close();
			resolve(promptDialogTextInput.val());
		});	
		// Click CANCEL
		promptDialogCancel.off('click');
		promptDialogCancel.on('click', () =>
		{
			// Close dialog
			close();
			reject(null);
		});
	});

	// Display dialog
	function show()
	{
		promptDialogContainer.addClass('active');
	}
	// Close dialog
	function close()
	{
		promptDialogContainer.removeClass('active');
	}

	return promise;
}
// Prompt confirm dialog
PromptConfirmDialog = (title = '', html = '') =>
{
	var promptDialogContainer = $('#promptConfirmDialog');
	var promptDialogTitle = promptDialogContainer.find('.block-title');
	var promptDialogCloseBTN = promptDialogContainer.find('#closeBTN');
	var promptDialogBody = promptDialogContainer.find('.block-body');
	var promptDialogOK = promptDialogContainer.find('#okBTN');
	var promptDialogCancel = promptDialogContainer.find('#cancelBTN');

	// change text direction
	if ( FUI_DISPLAY_LANG.lang == 'fr' )
	{
		promptDialogContainer.removeClass('text-align-r');
	}
	if ( title.length == 0 )
	{
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			title = "تأكيد العمل";
		if ( FUI_DISPLAY_LANG.lang == 'fr' )
			title = "Confirmer";
	}

	if ( html.length == 0 )
	{
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			html = "هل أنت متأكد؟";
		if ( FUI_DISPLAY_LANG.lang == 'fr' )
			html = "Êtes-vous sûr?";
	}
	var promise = new Promise((resolve, reject) =>
	{
		// Display dialog
		show();
		// Set title
		promptDialogTitle.text(title);
		// Set body html
		promptDialogBody.html(html);
		//CLose dialog
		promptDialogCloseBTN.off('click');
		promptDialogCloseBTN.on('click', e =>
		{
			e.preventDefault();
			close();
		});

		// Click OK
		promptDialogOK.off('click');
		promptDialogOK.on('click', () =>
		{
			// Close dialog
			close();
			resolve(true);
		});	
		// Click CANCEL
		promptDialogCancel.off('click');
		promptDialogCancel.on('click', () =>
		{
			// Close dialog
			close();
			reject(false);
		});
	});

	// Display dialog
	function show()
	{
		promptDialogContainer.addClass('active');
	}
	// Close dialog
	function close()
	{
		promptDialogContainer.removeClass('active');
	}

	return promise;
}


});
