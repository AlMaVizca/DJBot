from flask import jsonify


def msg_saved():
    return jsonify({
        'messageMode': 0,
        'messageText': 'Saved.'
    })


def msg_failed():
    return jsonify({
        'messageMode': 1,
        'messageText': 'There was an error processing the form.'
    })
