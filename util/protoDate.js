/**
 * Returns a date object from google.protobuf.Timestamp object
 * 
 * @param {protoDate} google.protobuf.Timestamp object
 */
function fromProtoDate(protoDate) {
	return new Date(protoDate.seconds*1000 + protoDate.nanos/1000);
}

/**
 * Returns google.protobuf.Timestamp object from a iso string date
 *
 * @param {isoStringDate} iso string date e.g. "2020-05-31T00:00:00"
 */

function toProtoDate(isoStringDate) {
	let date = Date.parse(isoStringDate);
	return {
		seconds: Math.floor(date/1000),
		nanos: (date%1000)*1000,
	}
}

module.exports = {
	fromProtoDate: fromProtoDate,
	toProtoDate: toProtoDate,
}