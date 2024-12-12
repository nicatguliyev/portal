$(document).ready(function ()
{
    var getEnteredReadOnlyData = function()
    {
        
    }

    // --------------  objectEnabledOrDisabled -------------->
    function objectEnabledOrDisabled(htmlObject, inputType, enableStatus)
    {
        console.log({ htmlObject, inputType, enableStatus });

        if (inputType == "select" && enableStatus == false) {
            $(htmlObject).prop('disabled', true);

            $(htmlObject).val('').trigger('change');

            $(htmlObject).select2({
                placeholder: ""
            });

            // Set background color using JavaScript
            $(htmlObject).next('.select2-container').find('.selection').css({
                'background-color': '#dddd',
                'border-radius': '8px'
            });

            $(htmlObject).prop('disabled', true);
        }

        if (inputType == "select" && enableStatus == true) {
            //$(htmlObject).val('').trigger('change');

            //$(htmlObject).select2({
            //    placeholder: "Seçin"
            //});

            // Set background color using JavaScript
            $(htmlObject).next('.select2-container').find('.selection').css({
                'background-color': '#f1f2f6'
            });

            $(htmlObject).prop('disabled', false);
        }

        if (inputType == "input" && enableStatus == false) {
            $(htmlObject).prop('disabled', true);
            $(htmlObject).css('background', '#E7E7E7');
        }

        if (inputType == "input" && enableStatus == true) {
            $(htmlObject).prop('disabled', false);
            $(htmlObject).css('background', '#f1f2f6');
        }
    }

    objectEnabledOrDisabled('#fincode', 'input', false);
    objectEnabledOrDisabled('#mail', 'input', false);
    objectEnabledOrDisabled('#phoneNumber', 'input', false);

    // --------------  initializeInputMask -------------->
    var initializeInputMask = function ()
    {
        // -------> FUNCTIONS
        var DateTimeMask = function (input)
        {
            let $dateInput = $(input);
            $(input).attr('maxlength', "10");
            $dateInput.on("input", function () {
                function formatDateTime(value) {
                    // Remove any non-digit characters
                    value = value.replace(/\D/g, "");

                    // Format as 'DD/MM/YYYY HH:mm'
                    var formattedValue = "";
                    for (var i = 0; i < value.length; i++) {
                        if (i === 2 || i === 4) formattedValue += ".";
                        else if (i === 8) formattedValue += " ";
                        else if (i === 10) formattedValue += ":";

                        formattedValue += value[i];
                    }
                    return formattedValue;
                }

                let inputValue = $dateInput.val();
                let dayValue = inputValue.substring(0, 2);
                let monthValue = inputValue.substring(3, 5);
                let hourValue = inputValue.substring(11, 13);
                let minuteValue = inputValue.substring(14, 16);

                let isDay = dayValue >= 0 && dayValue <= 31 && dayValue !== '00';
                let isMonth = monthValue >= 0 && monthValue <= 12 && monthValue !== '00';
                let isHour = hourValue >= 0 && hourValue <= 23;
                let isMinute = minuteValue >= 0 && minuteValue <= 59;

                let formattedValue = formatDateTime(inputValue);
                $dateInput.val(formattedValue);

                if (!isDay) $dateInput.val("");
                if (!isMonth) $dateInput.val(inputValue.substring(0, 2));
                if (!isHour) $dateInput.val(inputValue.substring(0, 11));
                if (!isMinute) $dateInput.val(inputValue.substring(0, 14));
            });
        };

        // -------> only date format [dd.MM.yyyy]
        $('#birthdate').on('input', function ()
        {
            DateTimeMask(`#${$(this).attr("id")}`);
        });

        // -------> only letter input
        $('#firstname, #lastname, #patronymic').on('input', function (e)
        {
            e.target.value = e.target.value.replace(/[^A-Za-z]/g, '');
        });

        // -------> only positive natural number input
        $('#identityCardNumber').on('input', function (e)
        {
            e.target.value = e.target.value.replace(/[^1-9][^0-9]*|^0/g, '');
        });

        // ------->  only letter or positive natural number input
        $('#fincode').on('input', function (e)
        {
            e.target.value = e.target.value.replace(/[^A-Za-z1-9][^0-9]*|^0/g, '').toUpperCase();
        });
    }

    // --------------  select2InitializeOperation -------------->
    var select2InitializeOperations = function ()
    {
        // Function to initialize Select2 with common options
        var initializeSelect2 = function(selectors, options)
        {
            selectors.forEach(selector => {
                $(selector).select2(options);
            });
        }

        var initCountryDialAndFlagSelect2 = function()
        {
            fetch("/jsonFiles/countries.json")
                //fetch('/portal_simple/js/countries.json')
                .then(response => response.json())
                .then(data => {
                    // Populate the <select> element
                    const phoneSelectElement = $('#country_flag_dialCode');

                    phoneSelectElement.append("<option></option>");

                    data.forEach(country => {
                        const option = $(`<option></option>`)
                            .val(country.code)
                            .text(`${country.dial_code} ${country.name} `)
                            .attr('data-flag', country.flag)
                            .attr('data-code', country.dial_code);

                        phoneSelectElement.append(option);
                    });

                    // Initialize Select2 with flag rendering
                    phoneSelectElement.select2({
                        templateResult: formatPhoneSelectOption,
                        templateSelection: formatPhoneSelectOption,
                        placeholder: "Seçin"
                    });

                    phoneSelectElement.on('select2:select', function ()
                    {
                        objectEnabledOrDisabled('#phoneNumber', 'input', true);
                        $('#phoneNumber').val('');
                    })

                    function formatPhoneSelectOption(option)
                    {
                        if (!option.id) return option.text;

                        const flagUrl = $(option.element).data('flag');
                        const countryName = option.text;

                        return $(
                            `<span>
                        <img src="${flagUrl}" class="flag-icon" alt="" />
                        ${countryName}
                        </span>`
                        );
                    }
                })
                .catch(error => console.error('Error loading countries:', error));
        }

        var initCitizenshipSelect2 = function()
        {
            fetch("/jsonFiles/citizenship.json")
                .then(response => response.json())
                .then(data => {
                    // Populate the <select> element
                    const citizenshipSelectElement = $('#citizenship');

                    citizenshipSelectElement.append("<option></option>");

                    data.forEach(country => {
                        const option = $(`<option></option>`)
                            .val(country.name)
                            .text(`${country.name} `)
                            .attr('data-flag', country.flag)

                        citizenshipSelectElement.append(option);
                    });

                    // Initialize Select2 with flag rendering
                    citizenshipSelectElement.select2({
                        templateResult: formatPhoneSelectOption,
                        templateSelection: formatPhoneSelectOption,
                        placeholder: "Seçin"
                    });

                    function formatPhoneSelectOption(option) {
                        if (!option.id) return option.text;

                        const flagUrl = $(option.element).data('flag');
                        const countryName = option.text;

                        return $(
                            `<span>
                        <img src="${flagUrl}" class="flag-icon" alt="" />
                        ${countryName}
                    </span>`
                        );
                    }
                })
                .catch(error => console.error('Error loading countries:', error));
        }

        const commonOptions = {
            placeholder: 'Seçin',
            dropdownParent: $('.main_form')
        };

        initializeSelect2([
            '#applicant',
            '#application_type',
            '#citizenship',
            '#country_flag_dialCode',
            '#to_organization',
            '#passport_type',
            '#serial_number',
            '#dial_code',
            '#registrationCountry'
        ], {
            ...commonOptions,
            minimumResultsForSearch: Infinity // Disable the search box
        });

        // Initialize Select2 for dropdowns with default options
        initializeSelect2([

        ], commonOptions);

        initCountryDialAndFlagSelect2();
        initCitizenshipSelect2();
    }

    // --------------  Select2OnSelectOperation ---------------->
    var select2OnSelectOperations = function ()
    {
        var applicationTypeSelectOperation = function (applicationType)
        {
            const physicalPersonFields = [
                'citizenship',
                'firstname',
                'lastname',
                'patronymic',
                'birthdate',
                'passport_type',
                'serial_number',
                'identityCardNumber',
                'fincode',
                'registrationAddress',
                'actualResidentialAddress'
            ];

            const juridicalPersonFields = [
                'registrationCountry',
                'companyName',
                'voen',
                'companyAddress'
            ];

            if (applicationType == "Fiziki şəxs") {
                physicalPersonFields.map(el => {
                    if ($(`#${el}`).parents(".col-12").css('display') == 'none') {
                        $(`#${el}`).parents(".col-12").css('display', 'flex');
                    }
                });

                juridicalPersonFields.map(el => {
                    if ($(`#${el}`).parents(".col-12").css('display') !== 'none') {
                        $(`#${el}`).parents(".col-12").css('display', 'none');
                    }
                });

                $('#to_organization').parents(".col-12").removeClass('col-xl-4');
                $('#to_organization').parents(".col-12").addClass('col-xl-6');
            }

            if (applicationType == "Hüquqi şəxs") {
                physicalPersonFields.map(el => {
                    if ($(`#${el}`).parents(".col-12").css('display') !== 'none') {
                        $(`#${el}`).parents(".col-12").css('display', 'none');
                    }
                });

                juridicalPersonFields.map(el => {
                    if ($(`#${el}`).parents(".col-12").css('display') == 'none') {
                        $(`#${el}`).parents(".col-12").css('display', 'flex');
                    }
                });

                $('#to_organization').parents(".col-12").removeClass('col-xl-6');
                $('#to_organization').parents(".col-12").addClass('col-xl-4');

                $('.custom-radio-group').parents(".col-12").removeClass('col-xl-6');
                $('.custom-radio-group').parents(".col-12").addClass('col-xl-4');
            }
        }

        var citizenshipTypeSelectOperation = function ()
        {
            objectEnabledOrDisabled('#serial_number', 'select', false);
            objectEnabledOrDisabled('#identityCardNumber', 'input', false);
        }

        applicationTypeSelectOperation("Fiziki şəxs");

        $(
            `
                #application_type,
                #citizenship,
                #country_flag_dialCode,
                #to_organization,
                #passport_type,
                #serial_number,
                #dial_code
            `
        )
            .on('select2:select', function () {
                initStyleValidation($(this), true, 'select');
            });

        $("#applicant").on('select2:select', function () {
            initStyleValidation($(this), true, 'select');
            applicationTypeSelectOperation($(this).val());
        });

        $("#citizenship").on('select2:select', function ()
        {
            const citizenshipType = $(this).val();

            if (citizenshipType == 'Azərbaycan')
            {
                objectEnabledOrDisabled('#fincode', 'input', true);
                objectEnabledOrDisabled('#serial_number', 'select', true);
                objectEnabledOrDisabled('#identityCardNumber', 'input', true);
                $("#passportNumber").parents(".col-12").addClass("d-none");
                $("#fincode").parents(".col-12").removeClass("d-none");
            }

            if (citizenshipType !== 'Azərbaycan') {
                objectEnabledOrDisabled('#serial_number', 'select', false);
                objectEnabledOrDisabled('#identityCardNumber', 'input', false);
                $("#passportNumber").parents(".col-12").removeClass("d-none");
                $("#fincode").parents(".col-12").addClass("d-none");
            }
        });

        $("#passport_type").on('select2:select', function ()
        {
            const passport_type = $(this).val();

            if ((passport_type === 'Şəxsiyyət vəsiqəsi') || (passport_type === 'Müvəqqəti yaşayış icazəsi'))
            {
                objectEnabledOrDisabled('#serial_number', 'select', true);
                objectEnabledOrDisabled('#fincode', 'input', true);

                $("#passportNumber").parents(".col-12").addClass("d-none");
                $("#fincode").parents(".col-12").removeClass("d-none");
            }

            if (passport_type == 'Xarici pasport')
            {
                objectEnabledOrDisabled('#serial_number', 'select', false);
                objectEnabledOrDisabled('#fincode', 'input', false);

                $("#passportNumber").parents(".col-12").removeClass("d-none");
                $("#fincode").parents(".col-12").addClass("d-none");
            }
        });
    }

    var inputOnInputOperations = () =>
    {
        $('input[type="text"], input[type="number"], textarea').each(function () {
            $(this).on('input', function () {
                if ($(this).val() !== '') {
                    initStyleValidation($(this), true, 'input');
                }
                else {
                    initStyleValidation($(this), false, 'input');
                }
            });
        });

        $('#phoneNumber').on('input', function (e)
        {
            let country_dialCode = $('#country_flag_dialCode option:selected').attr('data-code');

            if (country_dialCode == '+994')
            {
                $(this).attr('maxlength', 12);

                // Remove non-numeric characters
                let value = e.target.value.replace(/\D/g, '');

                // Apply mask: 55-937-32-10
                if (value.length > 2) value = value.slice(0, 2) + '-' + value.slice(2);
                if (value.length > 6) value = value.slice(0, 6) + '-' + value.slice(6);
                if (value.length > 9) value = value.slice(0, 9) + '-' + value.slice(9);

                // Update the input value
                e.target.value = value;
            }
            else
            {
                $(this).attr('maxlength', 50);
                e.target.value = e.target.value.replace(/[^1-9][^0-9]*|^0/g, '');
            }
        });
    }

    // --------------  date valdiation function ------------------>

    // --------------  FORM DATA (get and validate) -------------->
    var getFormData = () => {
        const fields = [
            "applicant",
            "application_type",
            "citizenship",
            "firstname",
            "lastname",
            "patronymic",
            "birthdate",
            "passport_type",
            "serial_number",
            "identityCardNumber",
            "fincode",
            "to_organization",
            "city",
            "registrationAddress",
            "actualResidentialAddress",
            "mail",
            "country_flag_dialCode",
            "phoneNumber",
            "note"
        ];

        const data = fields.reduce((acc, field) => {
            const element = $(`#${field}`);

            if (field === "country_flag_dialCode")
            {
                acc[field] = element.find("option:selected").attr("data-code")
            }
            else if (field === "note") {    
                acc[field] = element.text()
            }
            else {
                acc[field] = element.val()
            }

            return acc;
        }, {});

        console.log(data);
        return data;
    };

    var validateForm = () => {
        const data = getFormData();

        const validations = [
            { field: "applicant", type: "select" },
            { field: "application_type", type: "select" },
            { field: "citizenship", type: "select" },
            { field: "firstname", type: "input" },
            { field: "lastname", type: "input" },
            { field: "patronymic", type: "input" },
            { field: "birthdate", type: "input" },
            { field: "passport_type", type: "select" },
            { field: "serial_number", type: "select" },
            { field: "identityCardNumber", type: "select" },
            { field: "identityCardNumber", type: "input" },
            { field: "fincode", type: "input" },
            { field: "to_organization", type: "select" },
            { field: "city", type: "input" },
            { field: "registrationAddress", type: "input" },
            { field: "actualResidentialAddress", type: "input" },
            { field: "mail", type: "input" },
            { field: "country_flag_dialCode", type: "select" },
            { field: "phoneNumber", type: "input" },
            { field: "note", type: "input" }


        ];

        validations.forEach(({ field, type }) => {
            if (!data[field]) {
                const inputObject = $(`#${field}`);
                initStyleValidation(inputObject, false, type);
            }
        });
    };

    var initStyleValidation = function (inputObject, isValid, inputType) {
        if (!isValid) {
            if (inputType === "select") {
                // Update styles for select inputs
                const selectContainer = inputObject.siblings(".select2-container");
                selectContainer.find(".select2-selection__arrow b").css("background-image", "url(/src/images/arrow_red.png)");
                selectContainer.find(".select2-selection__placeholder").css("color", "var(--Orange-500, #DA4E3B)");
                selectContainer.find(".select2-selection--single").addClass("myCustomSelect2");
            }

            if (inputType === "input") {
                // Update styles for input fields
                inputObject.addClass("nonValidInput-placeholder myCustomSelect2");
            }

            // Display error message
            inputObject.closest(".form_input_section").find(".text-danger").html("Bu bölmə doldurulmalıdır");
        }

        if (isValid) {
            if (inputType === "select") {
                // Update styles for select inputs
                const selectContainer = inputObject.siblings(".select2-container");

                selectContainer.find(".select2-selection__arrow b").css("background-image", "url(/src/images/arrow.png)");
                selectContainer.find(".select2-selection__placeholder").css("color", "#999");
                selectContainer.find(".select2-selection--single").removeClass("myCustomSelect2");
            }
            if (inputType === "input") {
                inputObject.removeClass("nonValidInput-placeholder myCustomSelect2");
            }

            inputObject.closest(".form_input_section").find(".text-danger").html("");
        }
    };

    $("#mainFile").on('change', function ()
    {
        let fileDetails = [];
        $(".form_input_section_file_body_list").empty();


        Array.from(this.files).forEach((file, index) => {
            fileDetails.push(
                {
                    // "fileIndex": `${index + 1}`,
                    "fileName": `${file.name}`,
                    "fileSize": `${(file.size / 1024).toFixed(2)} KB`,
                    // "fileType": `${file.type}`,
                    // "lastModified:": `${new Date(file.lastModified).toLocaleString()}`,
                }
            )
        });

        fileDetails.map((el) => {
            $(".form_input_section_file_body_list").append(
                `
                        <div class="file_details">
                            <p>${el.fileName}</p>
                            <div style="width: 24px; height: 24px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                    <path d="M21.5 14.25C21.5 14.4489 21.421 14.6397 21.2803 14.7803C21.1397 14.921 20.9489 15 20.75 15H18.5V16.5H20C20.1989 16.5 20.3897 16.579 20.5303 16.7197C20.671 16.8603 20.75 17.0511 20.75 17.25C20.75 17.4489 20.671 17.6397 20.5303 17.7803C20.3897 17.921 20.1989 18 20 18H18.5V19.5C18.5 19.6989 18.421 19.8897 18.2803 20.0303C18.1397 20.171 17.9489 20.25 17.75 20.25C17.5511 20.25 17.3603 20.171 17.2197 20.0303C17.079 19.8897 17 19.6989 17 19.5V14.25C17 14.0511 17.079 13.8603 17.2197 13.7197C17.3603 13.579 17.5511 13.5 17.75 13.5H20.75C20.9489 13.5 21.1397 13.579 21.2803 13.7197C21.421 13.8603 21.5 14.0511 21.5 14.25ZM9.125 16.125C9.125 16.8212 8.84844 17.4889 8.35616 17.9812C7.86387 18.4734 7.19619 18.75 6.5 18.75H5.75V19.5C5.75 19.6989 5.67098 19.8897 5.53033 20.0303C5.38968 20.171 5.19891 20.25 5 20.25C4.80109 20.25 4.61032 20.171 4.46967 20.0303C4.32902 19.8897 4.25 19.6989 4.25 19.5V14.25C4.25 14.0511 4.32902 13.8603 4.46967 13.7197C4.61032 13.579 4.80109 13.5 5 13.5H6.5C7.19619 13.5 7.86387 13.7766 8.35616 14.2688C8.84844 14.7611 9.125 15.4288 9.125 16.125ZM7.625 16.125C7.625 15.8266 7.50647 15.5405 7.2955 15.3295C7.08452 15.1185 6.79837 15 6.5 15H5.75V17.25H6.5C6.79837 17.25 7.08452 17.1315 7.2955 16.9205C7.50647 16.7095 7.625 16.4234 7.625 16.125ZM15.875 16.875C15.875 17.7701 15.5194 18.6285 14.8865 19.2615C14.2535 19.8944 13.3951 20.25 12.5 20.25H11C10.8011 20.25 10.6103 20.171 10.4697 20.0303C10.329 19.8897 10.25 19.6989 10.25 19.5V14.25C10.25 14.0511 10.329 13.8603 10.4697 13.7197C10.6103 13.579 10.8011 13.5 11 13.5H12.5C13.3951 13.5 14.2535 13.8556 14.8865 14.4885C15.5194 15.1215 15.875 15.9799 15.875 16.875ZM14.375 16.875C14.375 16.3777 14.1775 15.9008 13.8258 15.5492C13.4742 15.1975 12.9973 15 12.5 15H11.75V18.75H12.5C12.9973 18.75 13.4742 18.5525 13.8258 18.2008C14.1775 17.8492 14.375 17.3723 14.375 16.875ZM4.25 10.5V3.75C4.25 3.35218 4.40804 2.97064 4.68934 2.68934C4.97064 2.40804 5.35218 2.25 5.75 2.25H14.75C14.8485 2.24992 14.9461 2.26926 15.0371 2.3069C15.1282 2.34454 15.2109 2.39975 15.2806 2.46938L20.5306 7.71938C20.6003 7.78908 20.6555 7.87182 20.6931 7.96286C20.7307 8.05391 20.7501 8.15148 20.75 8.25V10.5C20.75 10.6989 20.671 10.8897 20.5303 11.0303C20.3897 11.171 20.1989 11.25 20 11.25C19.8011 11.25 19.6103 11.171 19.4697 11.0303C19.329 10.8897 19.25 10.6989 19.25 10.5V9H14.75C14.5511 9 14.3603 8.92098 14.2197 8.78033C14.079 8.63968 14 8.44891 14 8.25V3.75H5.75V10.5C5.75 10.6989 5.67098 10.8897 5.53033 11.0303C5.38968 11.171 5.19891 11.25 5 11.25C4.80109 11.25 4.61032 11.171 4.46967 11.0303C4.32902 10.8897 4.25 10.6989 4.25 10.5ZM15.5 7.5H18.1897L15.5 4.81031V7.5Z" fill="#183D6E"/>
                                </svg>
                            </div>
                        </div>
                `
            )
        })
    })

    $('#submit').on('click', function ()
    {
        validateForm();
    });


    // -------------- MAIN SECTION -------------->
    getEnteredReadOnlyData();
    initializeInputMask();
    select2InitializeOperations();
    select2OnSelectOperations();
    inputOnInputOperations();
});
