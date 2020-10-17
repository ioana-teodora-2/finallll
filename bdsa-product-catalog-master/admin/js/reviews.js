/*global $*/

// READ recods on page load
$(document).ready(function () {
    readReviews(); // calling function
});

// READ records
function readReviews() {
    $.get("/reviews/", {}, function (data, status) {
        data.forEach(function(value) {
            var row = '<tr id="row_id_'+ value.id +'">'
            			+ displayColumns(value)
        				+ '</tr>';
            $('#articles').append(row);
        });
    });
}

function displayColumns(value) {
    return 	'<td>'+value.id+'</td>'
            + '<td class="product_id">'+value.product.name+'</td>'
            + '<td class="name">'+value.name+'</td>'
			+ '<td class="content">'+value.content+'</td>'
			+ '<td class="score">'+value.score+'</td>'
			+ '<td align="center">'
			+	'<button onclick="viewReview('+ value.id +')" class="btn btn-edit">Update</button>'
			+ '</td>'
			+ '<td align="center">'
			+	'<button onclick="deleteReview('+ value.id +')" class="btn btn-danger">Delete</button>'
			+ '</td>';
}

function addReview() {
    $('#id').val('');
    $('#product_id').val('');
    $('#name').val('');
    $('#content').val('');
    $('#price').val('');
    $('#myModalLabel').html('Add New Review');
}

function viewReview(id) {
    var url = "/reviews/" + id;
 
    $.get(url, {}, function (data, status) {
        //bind the values to the form fields
        $('#product_id').val(data.product_id);
        $('#name').val(data.name);
        $('#content').val(data.content);
        $('#score').val(data.score);
        $('#id').val(id);
        $('#myModalLabel').html('Edit Review');
        
        $('#add_new_review_modal').modal('show');
    });
}

function saveReview() {
    //get data from the html form
    var formData = $('#record_form').serializeObject();
    
    //decide if it's an edit or create
    if(formData.id) {
        updateReview(formData);
    } else {
        createReview(formData);
        window.location.reload();
        
    }
}

function createReview(formData) {
    $.ajax({
        url: '/reviews/',
        type: 'POST',
        accepts: {
            json: 'application/json'
        },
        data: formData,
        success: function(data) {
            $('#add_new_review_modal').modal('hide');
            
            var row = '<tr id="row_id_'+ data.id +'">'
            			+ displayColumns(data)
        				+ '</tr>';
            $('#articles').append(row);
            
        } 
    });
}

function updateReview(formData) {
    $.ajax({
        url: '/reviews/'+formData.id,
        type: 'PUT',
        accepts: {
            json: 'application/json'
        },
        data: formData,
        success: function(data) {
            $('#row_id_'+formData.id+'>td.product_id').html(formData.category_id);
            $('#row_id_'+formData.id+'>td.name').html(formData.name);
            $('#row_id_'+formData.id+'>td.content').html(formData.content);
            $('#row_id_'+formData.id+'>td.score').html(formData.price);
            $('#add_new_review_modal').modal('hide');
        } 
    });
}

function deleteReview(id) {
    $.ajax({
        url: '/reviews/'+id,
        type: 'DELETE',
        success: function(data) {
            $('#row_id_'+id).remove();
        }
    });
}