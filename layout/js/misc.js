VK.init({
  apiId: 4248680,
  onlyWidgets: true
});

//Yandex.Metrika counter
(function(d, w, c) {
  (w[c] = w[c] || []).push(function() {
    try {
      w.yaCounter24370156 = new Ya.Metrika({
        id: 24370156,
        webvisor: true,
        clickmap: true,
        accurateTrackBounce: true,
        trackHash: true
      });
    } catch (e) {}
  });

  var n = d.getElementsByTagName("script")[0],
    s = d.createElement("script"),
    f = function() {
      n.parentNode.insertBefore(s, n);
    };
  s.type = "text/javascript";
  s.async = true;
  s.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//mc.yandex.ru/metrika/watch.js";

  if (w.opera == "[object Opera]") {
    d.addEventListener("DOMContentLoaded", f, false);
  } else {
    f();
  }
})(document, window, "yandex_metrika_callbacks");

$(function() {
  $('#slideshow').cycle({
    fx: 'fade',
    timeout: 6000,
    pager: '#slideshow-nav',
    pagerAnchorBuilder: function(idx, slide) {
      // return sel string for existing anchor
      return '#slideshow-nav li:eq(' + (idx) + ') a';
    },
    speed: 'slow'
  });
  $('#direct').click(function() {
    $('#nav li:eq(2) a').triggerHandler('click');
    return false;
  });
});

function isEmail(email) {
  var regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (isNaN(email.substring(0, 1))) {
    return regex.test(email);
  } else {
    return false;
  }
}


//Отправка формы

sendStudent = function() {
  if (isEmail($("#inputEmail").val()) && $("#inputName").val() !== "" && $("#inputPhone").val() !== "") {

    //Формирование заявки:
    var currentdate = new Date();
    var student = $("#inputName").val();
    var studentPhone = $("#inputPhone").val();
    var studentEmail = $("#inputEmail").val();

    //Отправка в CouchDB
    $.couch.urlPrefix = "http://178.62.133.139:5994";

    var doc = {
      _id: studentEmail,
      student: student,
      phone: studentPhone,
      email: studentEmail,
      status: "new",
      date: currentdate.toString()
    };

    $.couch.db("aaaaa-" + window.school).saveDoc(doc, {
      success: function(data) {
        console.log(data);
      },
      error: function(status) {
        window.error = true;
        if (status == 409) {
          swal("Ошибка", 'Произошла ошибка при отправке заявки в базу данных, такой Email уже есть в базе, пожалуйста, сообщите об этом администрации сайта', "error");
        } else {
          swal("Ошибка", 'Произошла ошибка при отправке заявки в базу данных, пожалуйста, сообщите об этом администрации сайта', "error");
        }
        console.log(status);
      }
    });

    //Email нам
    jQuery.ajax({
      type: "POST",
      url: "https://mandrillapp.com/api/1.0/messages/send.json",
      data: {
        'key': 'pyL7NQYaVCP7PkkLq0BnSQ',
        'message': {
          'from_email': 'robot@rostov-english.ru',
          'from_name': 'Rostov-English.ru',
          'to': [{
            'email': "info@rostov-english.ru",
            'name': "",
            'type': 'to'
          }],
          'autotext': 'true',
          'subject': "Заявка в школу " + window.schoolName,
          'html': "В школу " + window.schoolName + " поступила новая заявка:<br><br>Имя: " + student + "<br>Телефон: " + studentPhone + "<br>E-mail: " + studentEmail + "<br>Дата: " + currentdate
        }
      }
    }).done(function(response) {}).fail(function(error) {
      window.error = true;
      swal("Ошибка", 'Произошла ошибка при попытке отправить уведомление на info@rostov-english.ru, пожалуйста, сообщите об этом администрации сайта', "error");
      console.log(error);
    });

    //Email школе
    jQuery.ajax({
      type: "POST",
      url: "https://mandrillapp.com/api/1.0/messages/send.json",
      data: {
        'key': 'pyL7NQYaVCP7PkkLq0BnSQ',
        'message': {
          'from_email': 'robot@rostov-english.ru',
          'from_name': 'Rostov-English.ru',
          'to': [{
            'email': "rybik@yandex.ru", //замениить на email школы
            'name': "",
            'type': 'to'
          }],
          'autotext': 'true',
          'subject': "Новая заявка с сайта Rostov-English.ru",
          'html': "В Вашу школу поступила новая заявка:<br><br>Имя: " + student + "<br>Телефон: " + studentPhone + "<br>E-mail: " + studentEmail + "<br>Дата: " + currentdate + "<br><br>Пожалуйста, перезвоните клиенту в ближайшее время, чтобы уточнить удобное время посещения.<br><br>__<br>Пожалуйста, не отвечайте на это письмо, по вопросам работы сайта Rostov-English.ru вы можете обращаться на info@rostov-english.ru"
        }
      }
    }).done(function(response) {}).fail(function(error) {
      window.error = true;
      swal("Ошибка", 'Произошла ошибка при попытке отправить уведомление в школу ' + window.schoolName + ', пожалуйста, сообщите об этом администрации сайта', "error");
      console.log(error);
    });

    //SMS школе
    jQuery.ajax({
      type: "POST",
      url: "https://mandrillapp.com/api/1.0/messages/send.json",
      data: {
        'key': 'pyL7NQYaVCP7PkkLq0BnSQ',
        'message': {
          'from_email': 'robot@rostov-english.ru',
          'from_name': 'Rostov-English.ru',
          'to': [{
            'email': "sms@massreach.com",
            'name': "",
            'type': 'to'
          }],
          'autotext': 'true',
          'subject': "19aaea01ce64bec8 79268613375", //заменить на телефон школы
          'html': "[SENDER]RosEnglish[/SENDER][SMS]Новая заявка на обучение! Имя: " + student + ", телефон: " + studentPhone + "[/SMS]"
        }
      }
    }).done(function(response) {}).fail(function(error) {
      window.error = true;
      swal("Ошибка", 'Произошла ошибка при попытке отправить смс-уведомление в школу ' + window.schoolName + ', пожалуйста, сообщите об этом администрации сайта', "error");
      console.log(error);
    });

    if (!window.error) {
      swal({
        title: "Спасибо",
        text: student + ", Ваша заявка успешно отправлена!<br>В ближайшее время Вам перезвонит сотрудник школы.<br><br><span style='display: block;'><img style='width: 16px;' src='images/vk.png'> <a target='_blank'  href='https://vk.com/rostov.english'>Подписывайтесь на сообщество Английский в Ростове</a>,</span><br>чтобы быть в курсе всех новостей про изучение английского языка в нашем городе.",
        type: "success",
        animation: "slide-from-top",
        html: true
      });
      //yaCounterSuccess + yaCounterVKClick

      $('#application').html("Ваша заявка успешно отправлена!<br>В ближайшее время Вам перезвонит сотрудник школы.<br>");
    }

  } else {
    swal("Ошибка", 'Пожалуйста, укажите Ваше имя, email и телефон', "error");
    //yaCounterFail
  }
};
