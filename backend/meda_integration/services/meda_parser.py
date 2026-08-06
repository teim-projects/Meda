import logging
from datetime import datetime
from decimal import Decimal
from meda_integration.models import ApiRawRecord, EnergyCreditNote

logger = logging.getLogger(__name__)

class MedaParser:
    @staticmethod
    def parse_date(date_val):
        """
        Parses various date formats to YYYY-MM-DD Date object.
        """
        if not date_val:
            return None
        if isinstance(date_val, datetime):
            return date_val.date()
        date_str = str(date_val).strip()
        if not date_str or date_str.lower() in ('none', 'null', ''):
            return None
            
        formats = [
            '%Y-%m-%d',
            '%d-%m-%Y',
            '%d/%m/%Y',
            '%Y/%m/%d',
            '%Y-%m-%dT%H:%M:%S',
            '%Y-%m-%dT%H:%M:%S.%fZ',
        ]
        for fmt in formats:
            try:
                return datetime.strptime(date_str.split('T')[0], '%Y-%m-%d').date() if 'T' in date_str and fmt == '%Y-%m-%d' else datetime.strptime(date_str, fmt).date()
            except ValueError:
                continue
        logger.warning(f"Unable to parse date string: {date_val}")
        return None

    @staticmethod
    def parse_decimal(val, decimal_places=2):
        """
        Safely converts value to Decimal or None.
        """
        if val is None or val == '':
            return None
        try:
            # Clean string input if any
            clean_str = str(val).replace(',', '').strip()
            return Decimal(clean_str)
        except Exception:
            return None

    @classmethod
    def parse_and_store_records(cls, month_str, raw_data_list, request_log=None):
        """
        Stores every raw JSON object into ApiRawRecord, then parses and upserts
        into EnergyCreditNote table using update_or_create.
        """
        success_count = 0
        failed_count = 0

        if not isinstance(raw_data_list, list):
            raw_data_list = [raw_data_list]

        if not raw_data_list:
            logger.warning(f"No data to parse for month {month_str}")
            return 0, 0

        logger.info(f"Processing {len(raw_data_list)} records for month {month_str}")

        for item in raw_data_list:
            if not isinstance(item, dict):
                logger.warning(f"Skipping non-dict raw item: {item}")
                failed_count += 1
                continue

            # 1. Save Raw Record (verbatim JSON)
            raw_record = ApiRawRecord.objects.create(
                request_log=request_log,
                month=month_str,
                raw_json=item,
                processed=False
            )

            try:
                # 2. Extract fields using key fallbacks (camelCase, snake_case, and MEDA API exact keys)
                zone_name = item.get('zoneName') or item.get('zone_name') or ''
                circle_name = item.get('circleName') or item.get('circle_name') or ''
                substation_code = item.get('substationCode') or item.get('substation_code') or ''
                substation_name = item.get('substationName') or item.get('substation_name') or ''
                feeder_code = item.get('feederCode') or item.get('feeder_code') or ''
                generator_name = (
                    item.get('generatorNameOrVendorName') or
                    item.get('generatorName') or
                    item.get('generator_name') or
                    item.get('vendorName') or
                    item.get('vendor_name') or ''
                )
                source = item.get('source') or ''
                agreement_capacity = cls.parse_decimal(item.get('agreementCapacity') or item.get('agreement_capacity'))
                nce_generator_code = item.get('nceGeneratorCode') or item.get('nce_generator_code') or ''
                metering_point_id = item.get('meteringPointId') or item.get('metering_point_id') or ''
                agreement_id = item.get('agreementId') or item.get('agreement_id') or f"UNKNOWN-{raw_record.id}"
                agreement_type = item.get('agreementType') or item.get('agreement_type') or ''
                agreement_type_description = (
                    item.get('agreementTypeDesc') or
                    item.get('agreementTypeDescription') or
                    item.get('agreement_type_desc') or
                    item.get('agreement_type_description') or ''
                )
                credit_note_type = item.get('creditNoteType') or item.get('credit_note_type') or ''
                date_of_commission = cls.parse_date(item.get('dateOfCommission') or item.get('date_of_commission'))
                credit_note_from_date = cls.parse_date(item.get('creditNoteFromDate') or item.get('credit_note_from_date'))
                credit_note_to_date = cls.parse_date(item.get('creditNoteToDate') or item.get('credit_note_to_date'))
                kwh_unit = cls.parse_decimal(item.get('kwhUnit') or item.get('kwh_unit'))
                kwh_rate = cls.parse_decimal(item.get('kwhRate') or item.get('kwh_rate'))
                kwh_charges = cls.parse_decimal(item.get('kwhCharges') or item.get('kwh_charges'))
                rkvah_unit = cls.parse_decimal(item.get('rkvahUnit') or item.get('rkvah_unit'))
                rkvah_rate = cls.parse_decimal(item.get('rkvahRate') or item.get('rkvah_rate'))
                rkvah_charges = cls.parse_decimal(item.get('rkvahCharges') or item.get('rkvah_charges'))

                defaults = {
                    'raw_record': raw_record,
                    'zone_name': zone_name,
                    'circle_name': circle_name,
                    'substation_code': substation_code,
                    'substation_name': substation_name,
                    'feeder_code': feeder_code,
                    'generator_name': generator_name,
                    'source': source,
                    'agreement_capacity': agreement_capacity,
                    'nce_generator_code': nce_generator_code,
                    'metering_point_id': metering_point_id,
                    'agreement_type': agreement_type,
                    'agreement_type_description': agreement_type_description,
                    'credit_note_type': credit_note_type,
                    'date_of_commission': date_of_commission,
                    'kwh_unit': kwh_unit,
                    'kwh_rate': kwh_rate,
                    'kwh_charges': kwh_charges,
                    'rkvah_unit': rkvah_unit,
                    'rkvah_rate': rkvah_rate,
                    'rkvah_charges': rkvah_charges,
                }

                # 3. Create EnergyCreditNote (storing whole data without deduplication)
                EnergyCreditNote.objects.create(
                    raw_record=raw_record,
                    zone_name=zone_name,
                    circle_name=circle_name,
                    substation_code=substation_code,
                    substation_name=substation_name,
                    feeder_code=feeder_code,
                    generator_name=generator_name,
                    source=source,
                    agreement_capacity=agreement_capacity,
                    nce_generator_code=nce_generator_code,
                    metering_point_id=metering_point_id,
                    agreement_id=agreement_id,
                    agreement_type=agreement_type,
                    agreement_type_description=agreement_type_description,
                    credit_note_type=credit_note_type,
                    date_of_commission=date_of_commission,
                    credit_note_from_date=credit_note_from_date,
                    credit_note_to_date=credit_note_to_date,
                    kwh_unit=kwh_unit,
                    kwh_rate=kwh_rate,
                    kwh_charges=kwh_charges,
                    rkvah_unit=rkvah_unit,
                    rkvah_rate=rkvah_rate,
                    rkvah_charges=rkvah_charges,
                )

                # Mark raw record as processed
                raw_record.processed = True
                raw_record.save(update_fields=['processed'])
                success_count += 1

            except Exception as e:
                logger.exception(f"Error parsing raw record ID {raw_record.id}: {e}")
                failed_count += 1

        logger.info(f"Parsing complete for month {month_str}: {success_count} success, {failed_count} failed")
        return success_count, failed_count

    @classmethod
    def reparse_all_raw_records(cls, clear_existing=False):
        """
        Re-parses all stored ApiRawRecords into EnergyCreditNote.
        Optionally clears existing EnergyCreditNote entries first if clear_existing=True.
        Stores every record without deduplication.
        """
        if clear_existing:
            logger.info("Clearing existing EnergyCreditNote records...")
            EnergyCreditNote.objects.all().delete()

        raw_records = ApiRawRecord.objects.all()
        logger.info(f"Re-parsing {raw_records.count()} raw records...")
        success_count = 0
        failed_count = 0

        for raw_record in raw_records:
            item = raw_record.raw_json
            if not isinstance(item, dict):
                failed_count += 1
                continue

            try:
                zone_name = item.get('zoneName') or item.get('zone_name') or ''
                circle_name = item.get('circleName') or item.get('circle_name') or ''
                substation_code = item.get('substationCode') or item.get('substation_code') or ''
                substation_name = item.get('substationName') or item.get('substation_name') or ''
                feeder_code = item.get('feederCode') or item.get('feeder_code') or ''
                generator_name = (
                    item.get('generatorNameOrVendorName') or
                    item.get('generatorName') or
                    item.get('generator_name') or
                    item.get('vendorName') or
                    item.get('vendor_name') or ''
                )
                source = item.get('source') or ''
                agreement_capacity = cls.parse_decimal(item.get('agreementCapacity') or item.get('agreement_capacity'))
                nce_generator_code = item.get('nceGeneratorCode') or item.get('nce_generator_code') or ''
                metering_point_id = item.get('meteringPointId') or item.get('metering_point_id') or ''
                agreement_id = item.get('agreementId') or item.get('agreement_id') or f"UNKNOWN-{raw_record.id}"
                agreement_type = item.get('agreementType') or item.get('agreement_type') or ''
                agreement_type_description = (
                    item.get('agreementTypeDesc') or
                    item.get('agreementTypeDescription') or
                    item.get('agreement_type_desc') or
                    item.get('agreement_type_description') or ''
                )
                credit_note_type = item.get('creditNoteType') or item.get('credit_note_type') or ''
                date_of_commission = cls.parse_date(item.get('dateOfCommission') or item.get('date_of_commission'))
                credit_note_from_date = cls.parse_date(item.get('creditNoteFromDate') or item.get('credit_note_from_date'))
                credit_note_to_date = cls.parse_date(item.get('creditNoteToDate') or item.get('credit_note_to_date'))
                kwh_unit = cls.parse_decimal(item.get('kwhUnit') or item.get('kwh_unit'))
                kwh_rate = cls.parse_decimal(item.get('kwhRate') or item.get('kwh_rate'))
                kwh_charges = cls.parse_decimal(item.get('kwhCharges') or item.get('kwh_charges'))
                rkvah_unit = cls.parse_decimal(item.get('rkvahUnit') or item.get('rkvah_unit'))
                rkvah_rate = cls.parse_decimal(item.get('rkvahRate') or item.get('rkvah_rate'))
                rkvah_charges = cls.parse_decimal(item.get('rkvahCharges') or item.get('rkvah_charges'))

                EnergyCreditNote.objects.create(
                    raw_record=raw_record,
                    zone_name=zone_name,
                    circle_name=circle_name,
                    substation_code=substation_code,
                    substation_name=substation_name,
                    feeder_code=feeder_code,
                    generator_name=generator_name,
                    source=source,
                    agreement_capacity=agreement_capacity,
                    nce_generator_code=nce_generator_code,
                    metering_point_id=metering_point_id,
                    agreement_id=agreement_id,
                    agreement_type=agreement_type,
                    agreement_type_description=agreement_type_description,
                    credit_note_type=credit_note_type,
                    date_of_commission=date_of_commission,
                    credit_note_from_date=credit_note_from_date,
                    credit_note_to_date=credit_note_to_date,
                    kwh_unit=kwh_unit,
                    kwh_rate=kwh_rate,
                    kwh_charges=kwh_charges,
                    rkvah_unit=rkvah_unit,
                    rkvah_rate=rkvah_rate,
                    rkvah_charges=rkvah_charges,
                )
                raw_record.processed = True
                raw_record.save(update_fields=['processed'])
                success_count += 1

            except Exception as e:
                logger.exception(f"Error in reparse for raw record {raw_record.id}: {e}")
                failed_count += 1

        logger.info(f"Reparse complete: {success_count} success, {failed_count} failed")
        return success_count, failed_count