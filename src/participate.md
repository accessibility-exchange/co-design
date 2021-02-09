---
title: Participate
layout: layouts/page
breadcrumbs: true
eleventyNavigation:
    key: Participate
    order: 5
---
If you'd like to participate in co-design sessions or learn more about the co-design and development process, you can
contact the co-design and development team using the contact form below.

<form id="contact" method="POST" action="/message-sent/" data-netlify="true">
    <div class="field">
        <label for="name">Full Name (required)</label>
        <input type="text" id="name" name="name" required>
    </div>
    <div class="field">
        <label for="email">Email Address (required)</label>
        <input type="email" id="email" name="email" required>
    </div>
    <div class="field">
        <label for="organization">Organization</label>
        <input type="text" id="organization" name="organization">
    </div>
    <div class="field">
        <label for="region">Province or Territory</label>
        <select id="region" name="region">
            <option value=""></option>
            <option value="AB">Alberta</option>
            <option value="BC">British Columbia</option>
            <option value="MB">Manitoba</option>
            <option value="NB">New Brunswick</option>
            <option value="NL">Newfoundland and Labrador</option>
            <option value="NT">Northwest Territories</option>
            <option value="NS">Nova Scotia</option>
            <option value="NU">Nunavut</option>
            <option value="ON">Ontario</option>
            <option value="PE">Prince Edward Island</option>
            <option value="QC">Québec</option>
            <option value="SK">Saskatchewan</option>
            <option value="YK">Yukon Territory</option>
        </select>
    </div>
    <div class="field">
        <label for="message">Message (required)</label>
        <textarea id="message" name="message" rows="12" required>
        </textarea>
    </div>
    <button type="submit">Send Message</button>
</form>
