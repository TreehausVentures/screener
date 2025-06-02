#!/usr/bin/env python3
import json
import csv

# ─── CONFIGURATION ─────────────────────────────────────────────────────────────────

REPORTS_FILE = 'Kauffman-reports.json'
SUMMARY_FILE = 'Kaufmann-summary.json'
OUTPUT_CSV = 'combined.csv'

# Updated FIELDNAMES list in the exact order you requested:
FIELDNAMES = [
    'ScreenerType',
    'Assessment',
    'Assessment Change',
    'Severity',
    'Severity Change',
    'Notes-Changes',
    'DocumentTitle',
    'DocTitleReview',
    'DocumentType',
    'DocTypeReview',
    'BorrowerItemType',
    'Names',
    'DateOrPeriod',
    'AccountType',
    'IssueType',
    'IssueTypeReview',
    'Description',
    'Recommendation',
    'Title'
]

# ─── UTILITY FUNCTION ────────────────────────────────────────────────────────────────

def load_json(path):
    """Return the parsed JSON object at ‘path’."""
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

# ─── MAIN SCRIPT ────────────────────────────────────────────────────────────────────

def main():
    # 1) Extract the “Summary” text from the summary‐file
    summary_data = load_json(SUMMARY_FILE).get('Report', {})
    top_level_summary_text = summary_data.get('Summary', '').strip()

    # 2) Build a list of all CSV rows, each as a dict containing every FIELDNAMES key
    rows = []

    # 2a) Process the “Reports” file → each ExtractedDocument → each Issue
    reports_data = load_json(REPORTS_FILE)
    for report in reports_data.get('Reports', []):
        for doc in report.get('ExtractedDocuments', []):
            base_row = {
                'ScreenerType':      'Reports',  # “Reports” for rows from reports.json
                'Assessment':        doc.get('Assessment', ''),
                'Assessment Change': '',         # placeholder
                'Severity':          '',         # will fill in per-issue
                'Severity Change':   '',         # placeholder
                'Notes-Changes':     '',         # placeholder
                'DocumentTitle':     doc.get('DocumentTitle', ''),
                'DocTitleReview':    '',         # new column, leave blank
                'DocumentType':      doc.get('DocumentType', ''),
                'DocTypeReview':     '',         # new column, leave blank
                'BorrowerItemType':  doc.get('BorrowerItemType', ''),
                'Names':             '; '.join(doc.get('Names', [])),
                'DateOrPeriod':      doc.get('DateOrPeriod', ''),
                'AccountType':       doc.get('ExtraInfo', {}).get('AccountType', ''),
                'IssueType':         '',         # will fill in per-issue
                'IssueTypeReview':   '',         # new column, leave blank
                'Description':       '',         # will fill in per-issue
                'Recommendation':    '',         # will fill in per-issue
                'Title':             ''          # leave blank for issue rows
            }

            for issue in doc.get('Issues', []):
                row = base_row.copy()
                row.update({
                    'Severity':       issue.get('Severity', ''),
                    'IssueType':      issue.get('IssueType', ''),
                    'Description':    issue.get('Description', ''),
                    'Recommendation': issue.get('Recommendation', ''),
                    'Title':          ''            # still blank at issue level
                })
                rows.append(row)

    # 2b) Process the “Summary”‐file → each top‐level Issue
    for issue in summary_data.get('Issues', []):
        rows.append({
            'ScreenerType':      'Summary',                     # “Summary” for rows from summary.json
            'Assessment':        summary_data.get('Assessment', ''),
            'Assessment Change': '',
            'Severity':          issue.get('Severity', ''),
            'Severity Change':   '',
            'Notes-Changes':     '',
            'DocumentTitle':     '',
            'DocTitleReview':    '',
            'DocumentType':      '',
            'DocTypeReview':     '',
            'BorrowerItemType':  '',
            'Names':             '',
            'DateOrPeriod':      '',
            'AccountType':       '',
            'IssueType':         issue.get('IssueType', ''),
            'IssueTypeReview':   '',
            'Description':       issue.get('Description', ''),
            'Recommendation':    issue.get('Recommendation', ''),
            'Title':             issue.get('Title', '')
        })

    # ─── WRITE EVERYTHING INTO CSV ─────────────────────────────────────────────────────

    with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as fout:
        writer = csv.DictWriter(fout, fieldnames=FIELDNAMES)

        # 3) Write the “Summary” text as a single row ABOVE the column headers.
        fout.write(f"Summary: {top_level_summary_text}\n")
        fout.write("\n")  # blank line

        # 4) Write the CSV header + all rows
        writer.writeheader()
        writer.writerows(rows)

    print(f"✅  Wrote {len(rows)} detail‐rows (plus summary) to “{OUTPUT_CSV}”.")


if __name__ == '__main__':
    main()
