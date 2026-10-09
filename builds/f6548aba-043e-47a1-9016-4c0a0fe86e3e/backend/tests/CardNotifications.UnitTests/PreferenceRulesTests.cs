using CardNotifications.Domain;

namespace CardNotifications.UnitTests;

public class PreferenceRulesTests
{
    [Theory]
    [InlineData(NotificationType.CardBlocked, Channel.InApp, true)]
    [InlineData(NotificationType.PurchaseDeclined, Channel.InApp, true)]
    [InlineData(NotificationType.CardBlocked, Channel.Email, false)]
    [InlineData(NotificationType.LimitChanged, Channel.InApp, false)]
    public void IsLocked_OnlySecurityEventsOnInApp(NotificationType type, Channel channel, bool expected) =>
        Assert.Equal(expected, PreferenceRules.IsLocked(type, channel));

    [Fact]
    public void Merge_StoredValueOverridesDefault()
    {
        var merged = PreferenceRules.Merge(new[] { new Preference(NotificationType.LimitChanged, Channel.Sms, true) });

        Assert.True(merged.Single(p => p.EventType == NotificationType.LimitChanged && p.Channel == Channel.Sms).Enabled);
        Assert.False(merged.Single(p => p.EventType == NotificationType.LimitChanged && p.Channel == Channel.Push).Enabled);
    }

    [Fact]
    public void Merge_ForcesLockedChannelEvenIfStoredDisabled()
    {
        var merged = PreferenceRules.Merge(new[] { new Preference(NotificationType.CardBlocked, Channel.InApp, false) });

        Assert.True(merged.Single(p => p.EventType == NotificationType.CardBlocked && p.Channel == Channel.InApp).Enabled);
    }

    [Fact]
    public void Validate_DuplicateEntries_ReportsError()
    {
        var errors = PreferenceRules.Validate(new[]
        {
            new Preference(NotificationType.LimitChanged, Channel.Email, true),
            new Preference(NotificationType.LimitChanged, Channel.Email, false)
        });

        Assert.Single(errors);
    }

    [Fact]
    public void Validate_UnknownEnumValue_ReportsError()
    {
        var errors = PreferenceRules.Validate(new[] { new Preference((NotificationType)99, Channel.Email, true) });

        Assert.NotEmpty(errors);
    }

    [Fact]
    public void FromEvent_BlankCustomer_ThrowsWithAllErrors()
    {
        var invalid = new CardEvent(" ", "", "1", NotificationType.CardBlocked, null);

        var error = Assert.Throws<DomainValidationException>(
            () => Notification.FromEvent(invalid, Guid.NewGuid(), DateTimeOffset.UnixEpoch));

        Assert.Equal(3, error.Errors.Count);
    }
}
