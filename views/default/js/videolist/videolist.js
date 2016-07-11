/**
 * Videolist javascript
 */
define(function(require) {
	var elgg = require('elgg');
	var $ = require('jquery');

	/**
	 * Find out video metadata on server side
	 */
	var getMetadata = function(e) {
		elgg.action('videolist/get_metadata_from_url', {
			data: { url: $('[name="video_url"]').val() },
			success: handleMetadata
		});
		e.preventDefault();
		return false;
	};

	/**
	 * Populate input fields with metadata received from server
	 */
	var handleMetadata = function(result) {
		if (result.error) {
			elgg.register_error(result.msg);
			return;
		}

		// Populate any input fields that exist with data from the video provider
		$.each(result.data, function(k, v) {
			var $input = $('[name="' + k + '"]');

			if ($input.length > 0) {
				// Flatten arrays and objects just in case.
				// For example Youtube returns the title as an object indexed by 0
				if (Object.prototype.toString.call( v ) === '[object Array]') {
					if (v.length > 0) {
						$input.val(v[0]);
					}
				} else if (typeof v == 'object') {
					$input.val(v[0]);
				} else {
					$input.val(v);
				}
			}

			$('input[name="video_url"]').prop('readonly', true);
		});

		// Special handing for TinyMCE's description field
		var description = result.data["description"];
		if (window.tinyMCE) {
			tinyMCE.activeEditor.setContent(description);
		}

		$('#videolist-metadata').show().removeClass('hidden');
		$('#videolist-continue-button').hide();
		$('#videolist-submit-button').show();
		$('input[name="title"]')[0].focus();
	};

	$(document).on('click', '#videolist-continue-button', getMetadata);
});
