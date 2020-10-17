//extending jQuery with a serializeObject method so that form values can be retrieved as JSON objects
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$(document).ready(function(){
    showCategories()
    showProducts()

})

function showCategories() {
    $.get( "/categories", function( data ) {
        var html = ''
        data.forEach(function(category) {
            html = html + '<li><a href="#" onClick="showProducts('+category.id+')">'+category.name+'</a></li>'
        })
        $('#categories').html(html)
    });
}

function addReview(idProdus){ 
    
    var url = "/products/"+ idProdus;
    
    $.get(url, {}, function (data, status) {
    
    
         $('#id').val('');
         $('#product_id').val(idProdus);
        $('#name').val(data.name);
        $('#content').val(data.content);
        $('#score').val(data.score);
       
        $('#myModalLabel1').html('Adauga Review');
        
       $('#add_new_review_modal').modal('show');
        
    });
}
function saveReview() { 
    var formData = $('#review_form').serializeObject();
    $.ajax({
        url: '/reviews/',
        type: 'POST',
        accepts: {
            json: 'application/json'
        },
        data: formData,
        success: function(data) {
            $('#add_new_review_modal').modal('hide');
       window.location.reload();
        } 
    });
}
//todo: implement showProducts method

function showProducts(categoryId) {
    if(categoryId) {
        var url = '/categories/'+ categoryId +'/products';
    } else {
        var url = '/products'   
    }
    $.get(url, function(data) {
        var html = '';
        data.forEach(
            function(product) {
                html = html + '<div class="product">'
                  +  '<h2>'+product.name+'</h2>'
                  +  '<p>'+product.description+'</p>'
                  +  '<p>Pret: '+product.price+'</p>'
                  +  '<p>Categorie: '+product.category.name+'</p>'
                + '</div>';
                
                html = html + '<h4 id="reviews">Review-uri Utilizatori</h4>'
                 
                if(product.reviews) {
                    product.reviews.forEach(
                        function(reviewData) {
                            html = html +'<p>' +'Nume User: ' +reviewData.name + ' Review: ' + reviewData.content+' Scor: '+reviewData.score+'</p>';
                            html = html + '<br>';
                        }
                    )
                }
                html = html + '<button class="btn btn-success" id="adg" data-toggle="modal" data-target="#add_new_review_modal" onclick="addReview('+product.id+')">Adauga un review</button>'
               
                

                
                //'<a href="#" onClick="addReview('+product.id+')">Add a review</a>'
                
               
                
               
                
                
            }
        )
        $('#content').html(html);
    })
    
    
    
}